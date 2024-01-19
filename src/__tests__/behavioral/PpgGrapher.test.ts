import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import PpgGrapher from '../../PpgGrapher'
import { PpgPeakDetectorResults } from '../../PpgPeakDetector'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'

export default class PpgGrapherTest extends AbstractSignalProcessingTest {
	private static grapher: SpyPpgGrapher

	private static savePath: string
	private static signals: PpgPeakDetectorResults

	protected static async beforeEach() {
		await super.beforeEach()
		this.grapher = this.Grapher()
		this.savePath = 'asdf'
		this.signals = {
			rawData: [],
			filteredData: [],
			timestamps: [],
			upperAnalyticSignal: [],
			upperEnvelope: [],
			lowerAnalyticSignal: [],
			lowerEnvelope: [],
			thresholdedData: [],
			segmentedData: [],
			peaks: [],
		} as PpgPeakDetectorResults
	}

	@test()
	protected static async runThrowsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = await assert.doesThrowAsync(() => this.grapher.run())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['savePath', 'signals'],
		})
	}

	@test()
	protected static async callsCreateSubplotCorrectNumberOfTimes() {
		await this.run()

		const expectedOptions = [
			{
				title: 'Raw PPG Data',
				datasets: [{ label: 'Raw PPG Data', data: this.signals.filteredData }],
			},
			{
				title: 'Filtered PPG Data (0.4-4 Hz Bandpass)',
				datasets: [
					{ label: 'Filtered PPG Data', data: this.signals.filteredData },
				],
			},
			{
				title: 'Upper Envelope (Hilbert)',
				datasets: [
					{ label: 'Filtered PPG Data', data: this.signals.filteredData },
					{ label: 'Upper Envelope', data: this.signals.upperEnvelope },
				],
			},
			{
				title: 'Lower Envelope (Hilbert)',
				datasets: [
					{ label: 'Filtered PPG Data', data: this.signals.filteredData },
					{ label: 'Upper Envelope', data: this.signals.upperEnvelope },
					{ label: 'Lower Envelope', data: this.signals.lowerEnvelope },
				],
			},
			{
				title: 'Thresholded PPG Data by Lower Envelope',
				datasets: [
					{ label: 'Thresholded PPG Data', data: this.signals.thresholdedData },
					{ label: 'Lower Envelope', data: this.signals.lowerEnvelope },
				],
			},
			{
				title: 'Peak Detection',
				datasets: [
					{ label: 'Thresholded PPG Data', data: this.signals.thresholdedData },
					{ label: 'Lower Envelope', data: this.signals.lowerEnvelope },
				],
			},
			{
				title: 'Peak Detection on Raw Data',
				datasets: [
					{ label: 'Raw PPG Data', data: this.signals.filteredData },
					{ label: 'Lower Envelope', data: this.signals.lowerEnvelope },
				],
			},
		]

		assert.isEqual(SpyPpgGrapher.createSubplotCallCount, 7)
		assert.isEqualDeep(SpyPpgGrapher.createSubplotCallOptions, expectedOptions)
	}

	protected static async run() {
		await this.grapher.run(this.savePath, this.signals)
	}

	private static Grapher() {
		return new SpyPpgGrapher()
	}
}

class SpyPpgGrapher extends PpgGrapher {
	public static createSubplotCallCount = 0
	public static createSubplotCallOptions: any[] = []

	public async createSubplot(options: any) {
		SpyPpgGrapher.createSubplotCallCount++
		SpyPpgGrapher.createSubplotCallOptions.push(options)
		await super.createSubplot(options)
	}
}
