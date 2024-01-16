import { test, assert } from '@sprucelabs/test-utils'
import HilbertPeakDetector from '../../HilbertPeakDetector'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyHilbertPeakDetector from '../support/SpyHilbertPeakDetector'
import SpyHilbertTransform from '../support/SpyHilbertTransform'

export default class HilbertPeakDetectorTest extends AbstractSignalProcessingTest {
	private static detector: HilbertPeakDetector

	private static Detector() {
		SpyHilbertTransform.clear()
		SpyHilbertPeakDetector.clear()
		return new SpyHilbertPeakDetector()
	}

	protected static async beforeEach() {
		HilbertPeakDetector.setHilbertClass(SpyHilbertTransform)
		this.detector = this.Detector()
	}

	@test()
	protected static canSetAndGetHilbertInstance() {
		HilbertPeakDetector.setHilbertClass(SpyHilbertTransform)
		assert.isEqual(HilbertPeakDetector.getHilbertClass(), SpyHilbertTransform)
	}

	@test()
	protected static async constructorInstantiatesHilbertTransform() {
		SpyHilbertTransform.clear()
		new HilbertPeakDetector()
		assert.isEqual(SpyHilbertTransform.constructorHitCount, 1)
	}

	@test()
	protected static async runCallsDependenciesAsExpected() {
		SpyHilbertTransform.clear()
		SpyHilbertPeakDetector.clear()
		this.detector.run([1, 2, 3, 4], [1, 2, 3, 4])
		assert.isEqual(SpyHilbertTransform.runHitCount, 2)
		assert.isEqual(SpyHilbertTransform.getEnvelopeHitCount, 2)
		assert.isEqual(SpyHilbertPeakDetector.generateSegmentsHitCount, 1)
		assert.isEqual(SpyHilbertPeakDetector.applyEnvelopeThresholdHitCount, 1)
		assert.isEqual(SpyHilbertPeakDetector.findPeaksHitCount, 1)
	}

	@test()
	protected static async runReturnsExpectedDataStructure() {
		const result = this.detector.run([1, 2, 3, 4], [1, 2, 3, 4])

		const {
			upperAnalyticSignal,
			upperEnvelope,
			lowerAnalyticSignal,
			lowerEnvelope,
			thresholdedData,
			segmentedData,
			peaks,
		} = result

		assert.isTruthy(upperAnalyticSignal)
		assert.isTruthy(upperEnvelope)
		assert.isTruthy(lowerAnalyticSignal)
		assert.isTruthy(lowerEnvelope)
		assert.isTruthy(thresholdedData)
		assert.isTruthy(segmentedData)
		assert.isTruthy(peaks)
	}

	@test()
	protected static async runPadsDataWithZerosToNearestPowerOfTwo() {
		const examples = [1, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15]
		examples.forEach((length) => this.runForLength(length))
	}

	private static runForLength(length: number) {
		const { data, timestamps } = this.generateDummyData(length)
		return this.detector.run(data, timestamps)
	}

	private static generateDummyData(length: number) {
		const data = []
		const timestamps = []

		for (let i = 0; i < length; i++) {
			data.push(i)
			timestamps.push(i)
		}

		return { data, timestamps }
	}
}
