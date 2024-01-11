import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import PpgAnalyzer, { PpgAnalyzerOptions } from '../../PpgAnalyzer'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import loadPpgData from '../support/loadPpgData'
import SpyPpgAnalyzer from '../support/SpyPpgAnalyzer'
import SpyPpgPeakDetector from '../support/SpyPpgPeakDetector'

export default class PpgAnalyzerTest extends AbstractSignalProcessingTest {
	private static analyzer: SpyPpgAnalyzer
	private static options: PpgAnalyzerOptions

	protected static async beforeEach() {
		PpgAnalyzer.setDetectorClass(SpyPpgPeakDetector)
		this.options = this.generateRandomOptions()
		this.analyzer = this.Analyzer(this.options)
	}

	private static Analyzer(
		options?: Partial<PpgAnalyzerOptions>
	): SpyPpgAnalyzer {
		const defaultOptions = this.generateRandomOptions()
		return new SpyPpgAnalyzer({
			...defaultOptions,
			...options,
		})
	}

	@test()
	protected static canSetAndGetDetectorInstance() {
		PpgAnalyzer.setDetectorClass(SpyPpgPeakDetector)
		assert.isEqual(PpgAnalyzer.getDetectorClass(), SpyPpgPeakDetector)
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => new PpgAnalyzer())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['sampleRate'],
		})
	}

	@test()
	protected static async constructorSavesOptions() {
		assert.isEqual(this.analyzer.getSampleRate(), this.options.sampleRate)
	}

	@test()
	protected static async constructorCanOverridePpgPeakDetector() {
		SpyPpgPeakDetector.clear()
		new PpgAnalyzer(this.options)
		assert.isEqual(SpyPpgPeakDetector.constructorHitCount, 1)
	}

	@test()
	protected static async runWorksWithActualPpgData() {
		const { values, timestamps } = await loadPpgData()
		const analyzer = new SpyPpgAnalyzer({ sampleRate: 64 })
		const result = analyzer.run(values, timestamps)
		const { signals, metrics } = result
		const { rrIntervals, hrv, hr } = metrics

		assert.isTruthy(signals)
		assert.isTruthy(metrics)
		assert.isLength(rrIntervals, 17)
		assert.isEqualDeep(
			rrIntervals,
			[
				702.9999999977008, 812.4000000025262, 781.1000000001513,
				765.4999999977008, 828.0000000013388, 874.8999999988882,
				906.1000000001513, 999.9000000025262, 1109.199999998964,
				1093.6000000001513, 1015.4999999977008, 921.7000000026019,
				968.6999999976251, 968.6000000001513, 968.6000000001513,
				999.9000000025262, 1093.4999999990396,
			]
		)
		assert.isTruthy(hrv)
		assert.isEqual(hrv, 65.2431557711733)
		assert.isTruthy(hr)
		assert.isEqual(hr, 64.51531289926798)
	}

	private static generateRandomOptions() {
		return { sampleRate: 100 * Math.random() }
	}
}
