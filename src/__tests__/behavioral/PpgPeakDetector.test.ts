import { randomInt } from 'crypto'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import FirBandpassFilter from '../../FirBandpassFilter'
import HilbertPeakDetector from '../../HilbertPeakDetector'
import PpgPeakDetector, { PpgPeakDetectorOptions } from '../../PpgPeakDetector'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import loadPpgData from '../support/loadPpgData'
import SpyFirBandpassFilter from '../support/SpyFirBandpassFilter'
import SpyPpgPeakDetector from '../support/SpyPpgPeakDetector'

export default class PpgPeakDetectorTest extends AbstractSignalProcessingTest {
	private static randomDetector: SpyPpgPeakDetector
	private static randomOptions: PpgPeakDetectorOptions

	protected static async beforeEach() {
		SpyPpgPeakDetector.setFilterClass(SpyFirBandpassFilter)
		SpyFirBandpassFilter.clear()

		this.randomOptions = this.generateRandomOptions()
		this.randomDetector = new SpyPpgPeakDetector(this.randomOptions)
	}

	@test()
	protected static async extendsHilbertPeakDetector() {
		assert.isInstanceOf(this.randomDetector, HilbertPeakDetector)
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
		assert.isEqual(
			this.randomDetector.getSampleRate(),
			this.randomOptions.sampleRate
		)
		assert.isEqual(
			this.randomDetector.getLowCutoffHz(),
			this.randomOptions.lowCutoffHz
		)
		assert.isEqual(
			this.randomDetector.getHighCutoffHz(),
			this.randomOptions.highCutoffHz
		)
		assert.isEqual(this.randomDetector.getNumTaps(), this.randomOptions.numTaps)
		assert.isEqual(
			this.randomDetector.getAttenuation(),
			this.randomOptions.attenuation
		)
	}

	@test()
	protected static async numTapsEqualsSampleRateTimesFourPlusOne() {
		const detector1 = new SpyPpgPeakDetector({ sampleRate: 100 })
		assert.isEqual(detector1.getNumTaps(), 401)
		const detector2 = new SpyPpgPeakDetector({ sampleRate: 100.5 })
		assert.isEqual(detector2.getNumTaps(), 401)
	}

	@test()
	protected static async constructorCreatesFilter() {
		assert.isInstanceOf(this.randomDetector.getFilter(), FirBandpassFilter)
	}

	@test()
	protected static async runCallsDependenciesAsExpected() {
		this.randomDetector.run([1, 2, 3, 4], [4, 5, 6, 7])
		assert.isEqual(SpyFirBandpassFilter.runHitCount, 1)
	}

	@test()
	protected static async peakDetectionWorksOnActualPpgData() {
		const { values, timestamps } = await loadPpgData()

		const detector = new PpgPeakDetector({ sampleRate: 64 })
		const result = detector.run(values, timestamps)

		const { peaks } = result

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
