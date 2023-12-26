import { test, assert } from '@sprucelabs/test-utils'
import HilbertPeakDetection from '../../HilbertPeakDetection'
import { normalizeArray } from '../../preprocess'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import { loadCsv } from '../support/loader'
import SpyFirBandpassFilter from '../support/SpyFirBandpassFilter'
import SpyHilbertPeakDetection from '../support/SpyHilbertPeakDetection'
import SpyHilbertTransform from '../support/SpyHilbertTransform'

export default class HilbertPeakDetectionTest extends AbstractSignalProcessingTest {
	private static detector: HilbertPeakDetection

	protected static async beforeEach() {
		HilbertPeakDetection.setFilterClass(SpyFirBandpassFilter)
		HilbertPeakDetection.setHilbertClass(SpyHilbertTransform)
		this.detector = this.Detector()
	}

	@test()
	protected static canSetAndGetFilterInstance() {
		HilbertPeakDetection.setFilterClass(SpyFirBandpassFilter)
		assert.isEqual(HilbertPeakDetection.getFilterClass(), SpyFirBandpassFilter)
	}

	@test()
	protected static canSetAndGetHilbertInstance() {
		HilbertPeakDetection.setHilbertClass(SpyHilbertTransform)
		assert.isEqual(HilbertPeakDetection.getHilbertClass(), SpyHilbertTransform)
	}

	@test()
	protected static async constructorInstantiatesDependenciesAsExpected() {
		SpyFirBandpassFilter.clear()
		SpyHilbertTransform.clear()
		this.detector = new HilbertPeakDetection()
		assert.isEqual(SpyFirBandpassFilter.constructorHitCount, 1)
		assert.isEqual(SpyHilbertTransform.constructorHitCount, 1)
	}

	@test()
	protected static async runCallsDependenciesAsExpected() {
		SpyFirBandpassFilter.clear()
		SpyHilbertTransform.clear()
		SpyHilbertPeakDetection.clear()
		this.detector.run([1, 2, 3, 4], [1, 2, 3, 4])
		assert.isEqual(SpyFirBandpassFilter.runHitCount, 1)
		assert.isEqual(SpyHilbertTransform.runHitCount, 2)
		assert.isEqual(SpyHilbertTransform.getEnvelopeHitCount, 2)
		assert.isEqual(SpyHilbertPeakDetection.generateSegmentsHitCount, 1)
		assert.isEqual(SpyHilbertPeakDetection.applyEnvelopeThresholdHitCount, 1)
		assert.isEqual(SpyHilbertPeakDetection.findPeaksHitCount, 1)
	}

	@test()
	protected static async peakDetectionWorksOnActualPpgData() {
		const bufferSize = 1024
		const data = await loadCsv('/Users/ericyates/Downloads/muse-ppg.csv')
		const buffer = data.slice(0, bufferSize)

		const infrared = normalizeArray(
			buffer.map((row) => Number(row['Infrared']))
		)
		const timestamps = buffer.map((row) => Number(row['time by space']))

		const peaks = this.detector.run(infrared, timestamps)
		assert.isLength(peaks, 18)
		peaks.forEach((peak) => {
			assert.isNumber(peak.value)
			assert.isNumber(peak.timestamp)
		})
	}

	private static Detector() {
		SpyFirBandpassFilter.clear()
		SpyHilbertTransform.clear()
		SpyHilbertPeakDetection.clear()
		return new SpyHilbertPeakDetection()
	}
}
