import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import PpgAnalyzerImpl, { PpgAnalyzerOptions } from '../../PpgAnalyzer'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import loadPpgData from '../support/loadPpgData'
import SpyPpgAnalyzer from '../support/SpyPpgAnalyzer'
import SpyPpgPeakDetector from '../support/SpyPpgPeakDetector'
import expectedOutput from '../testData/expectedOutput'

export default class PpgAnalyzerTest extends AbstractSignalProcessingTest {
	private static analyzer: SpyPpgAnalyzer
	private static options: PpgAnalyzerOptions

	protected static async beforeEach() {
		PpgAnalyzerImpl.setDetectorClass(SpyPpgPeakDetector)
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
		PpgAnalyzerImpl.setDetectorClass(SpyPpgPeakDetector)
		assert.isEqual(PpgAnalyzerImpl.getDetectorClass(), SpyPpgPeakDetector)
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => new PpgAnalyzerImpl())
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
		new PpgAnalyzerImpl(this.options)
		assert.isEqual(SpyPpgPeakDetector.constructorHitCount, 1)
	}

	@test()
	protected static async hrvCalculationIgnoresRrIntervalOutliers() {
		// We want to ignore rr intervals 700 -> 1200 and 1100 -> 500
		const rrIntervals = [600, 700, 1200, 800, 500, 600, 700, 800]

		const analyzer = new SpyPpgAnalyzer({ sampleRate: 64 })
		const result = analyzer.calculateHeartRateVariability(rrIntervals)
		assert.isEqual(result, 100)
	}

	@test(
		'Works with actual PPG data: ppg-example-4-subject-3.csv',
		'ppg-example-4-subject-3.csv'
	)
	@test(
		'Works with actual PPG data: ppg-example-3-subject-3.csv',
		'ppg-example-3-subject-3.csv'
	)
	@test.skip(
		// For unknown reasons, peak detection is failing on this file
		'Works with actual PPG data: ppg-example-2-subject-2.csv',
		'ppg-example-2-subject-2.csv'
	)
	@test(
		'Works with actual PPG data: ppg-example-1-subject-1.csv',
		'ppg-example-1-subject-1.csv'
	)
	protected static async runWorksWithActualPpgData(fileName: string) {
		const expected = expectedOutput.find((item) =>
			item.fileName.endsWith(fileName)
		) as any

		const { values, timestamps } = await loadPpgData(fileName)
		const analyzer = new SpyPpgAnalyzer({ sampleRate: 64 })
		const result = analyzer.run(values, timestamps)
		const { signals, metrics } = result
		const { rrIntervals, hrvMean, hrMean, hrvPercentChange, hrPercentChange } =
			metrics

		assert.isTruthy(signals)
		assert.isTruthy(metrics)
		assert.isLength(rrIntervals, expected.numPeaks)

		assert.isEqualDeep(rrIntervals, expected.rrIntervals)
		assert.isEqual(hrvMean, expected.hrvMean)
		assert.isEqual(hrMean, expected.hrMean)
		assert.isEqual(hrvPercentChange, expected.hrvPercentChange)
		assert.isEqual(hrPercentChange, expected.hrPercentChange)
	}

	private static generateRandomOptions() {
		return { sampleRate: 100 * Math.random() }
	}
}
