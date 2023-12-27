import { test, assert } from '@sprucelabs/test-utils'
import HilbertPeakDetector from '../../HilbertPeakDetector'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyHilbertPeakDetection from '../support/SpyHilbertPeakDetection'
import SpyHilbertTransform from '../support/SpyHilbertTransform'

export default class HilbertPeakDetectionTest extends AbstractSignalProcessingTest {
	private static detector: HilbertPeakDetector

	private static Detector() {
		SpyHilbertTransform.clear()
		SpyHilbertPeakDetection.clear()
		return new SpyHilbertPeakDetection()
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
	protected static async constructorInstantiatesDependenciesAsExpected() {
		SpyHilbertTransform.clear()
		this.detector = new HilbertPeakDetector()
		assert.isEqual(SpyHilbertTransform.constructorHitCount, 1)
	}

	@test()
	protected static async runCallsDependenciesAsExpected() {
		SpyHilbertTransform.clear()
		SpyHilbertPeakDetection.clear()
		this.detector.run([1, 2, 3, 4], [1, 2, 3, 4])
		assert.isEqual(SpyHilbertTransform.runHitCount, 2)
		assert.isEqual(SpyHilbertTransform.getEnvelopeHitCount, 2)
		assert.isEqual(SpyHilbertPeakDetection.generateSegmentsHitCount, 1)
		assert.isEqual(SpyHilbertPeakDetection.applyEnvelopeThresholdHitCount, 1)
		assert.isEqual(SpyHilbertPeakDetection.findPeaksHitCount, 1)
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
}
