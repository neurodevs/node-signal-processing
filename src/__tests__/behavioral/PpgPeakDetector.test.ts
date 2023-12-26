import { randomInt } from 'crypto'
import AbstractSpruceTest, {
	test,
	assert,
	errorAssert,
} from '@sprucelabs/test-utils'
import FirBandpassFilter from '../../FirBandpassFilter'
import HilbertPeakDetector from '../../HilbertPeakDetector'
import PpgPeakDetector, { PpgPeakDetectorOptions } from '../../PpgPeakDetector'
import { normalizeArray } from '../../preprocess'
import { loadCsv } from '../support/loader'
import SpyFirBandpassFilter from '../support/SpyFirBandpassFilter'
import SpyPpgPeakDetector from '../support/SpyPpgPeakDetector'

export default class PpgPeakDetectorTest extends AbstractSpruceTest {
	private static detector: SpyPpgPeakDetector
	private static options: PpgPeakDetectorOptions

	protected static async beforeEach() {
		SpyPpgPeakDetector.setFilterClass(SpyFirBandpassFilter)
		SpyFirBandpassFilter.clear()

		this.options = this.generateRandomOptions()
		this.detector = new SpyPpgPeakDetector(this.options)
	}

	@test()
	protected static async extendsHilbertPeakDetector() {
		assert.isInstanceOf(this.detector, HilbertPeakDetector)
	}

	@test()
	protected static canSetAndGetFilterInstance() {
		PpgPeakDetector.setFilterClass(SpyFirBandpassFilter)
		assert.isEqual(PpgPeakDetector.getFilterClass(), SpyFirBandpassFilter)
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => new PpgPeakDetector())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['sampleRate'],
		})
	}

	@test()
	protected static async constructorSavesOptions() {
		assert.isEqual(this.detector.getSampleRate(), this.options.sampleRate)
		assert.isEqual(this.detector.getLowCutoffHz(), this.options.lowCutoffHz)
		assert.isEqual(this.detector.getHighCutoffHz(), this.options.highCutoffHz)
		assert.isEqual(this.detector.getNumTaps(), this.options.numTaps)
		assert.isEqual(this.detector.getAttenuation(), this.options.attenuation)
	}

	@test()
	protected static async constructorCreatesFilter() {
		assert.isInstanceOf(this.detector.getFilter(), FirBandpassFilter)
	}

	@test()
	protected static async runCallsDependenciesAsExpected() {
		this.detector.run([1, 2, 3, 4], [4, 5, 6, 7])
		assert.isEqual(SpyFirBandpassFilter.runHitCount, 1)
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

		const detector = new PpgPeakDetector({ sampleRate: 64 })

		const peaks = detector.run(infrared, timestamps)
		assert.isLength(peaks, 18)
		peaks.forEach((peak) => {
			assert.isNumber(peak.value)
			assert.isNumber(peak.timestamp)
		})
	}

	private static generateRandomOptions() {
		const lowCutoffHz = Math.random()
		const highCutoffHz = randomInt(2, 10) * lowCutoffHz

		let numTaps = randomInt(51, 101)
		if (numTaps % 2 === 0) {
			// numTaps must be odd
			numTaps++
		}

		return {
			sampleRate: 100 * Math.random(),
			lowCutoffHz,
			highCutoffHz,
			numTaps,
			attenuation: 100 * Math.random(),
		}
	}
}
