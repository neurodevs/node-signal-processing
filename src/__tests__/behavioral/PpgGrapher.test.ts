import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import PpgGrapher, { Dataset } from '../../PpgGrapher'
import { PpgPeakDetectorResults } from '../../PpgPeakDetector'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyCanvas from '../support/SpyCanvas'
import SpyComposite from '../support/SpyComposite'
import SpyPpgGrapher from '../support/SpyPpgGrapher'

export default class PpgGrapherTest extends AbstractSignalProcessingTest {
	private static grapher: SpyPpgGrapher

	private static savePath: string
	private static signals: PpgPeakDetectorResults

	protected static async beforeEach() {
		await super.beforeEach()

		PpgGrapher.CanvasClass = SpyCanvas
		PpgGrapher.CompositeClass = SpyComposite

		SpyPpgGrapher.createSubplotOptions = []
		SpyPpgGrapher.combineSubplotsOptions = []

		SpyCanvas.constructorOptions = []
		SpyCanvas.renderOptions = []

		this.grapher = this.Grapher()
		this.savePath = 'asdf'

		const dataLength = 4

		this.signals = {
			rawData: this.generateRandomArray(dataLength),
			filteredData: this.generateRandomArray(dataLength),
			timestamps: this.generateRandomArray(dataLength),
			upperAnalyticSignal: this.generateRandomArray(dataLength),
			upperEnvelope: this.generateRandomArray(dataLength),
			lowerAnalyticSignal: this.generateRandomArray(dataLength),
			lowerEnvelope: this.generateRandomArray(dataLength),
			thresholdedData: this.generateRandomArray(dataLength),
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
	protected static async callsCreateSubplotWithExpectedOptions() {
		await this.run()
		assert.isEqualDeep(SpyPpgGrapher.createSubplotOptions, this.expectedOptions)
	}

	@test()
	protected static async callsCombineSubplotsWithExpectedOptions() {
		await this.run()

		assert.isEqualDeep(
			SpyPpgGrapher.combineSubplotsOptions[0]?.subplots.length,
			7
		)
	}

	@test()
	protected static async createSubplotCallsCanvasWithExpectedOptions() {
		await this.run()

		for (let i = 0; i < this.expectedOptions.length; i++) {
			assert.isEqualDeep(SpyCanvas.constructorOptions[i], {
				width: 800,
				height: 300,
			})

			const configuration = SpyCanvas.renderOptions[i]?.configuration

			const expectedOption = this.expectedOptions[i]

			const required = this.generateRequiredCanvasOptions(
				expectedOption.title,
				expectedOption.datasets
			)

			assert.doesInclude(configuration, required)
		}
	}

	@test()
	protected static async runCallsCompositeWithRequiredOptions() {
		await this.run()

		const expected = {
			create: {
				width: 800,
				height: 300 * 7,
				channels: 4,
				background: { r: 255, g: 255, b: 255, alpha: 0 },
			},
		}

		assert.isEqualDeep(SpyComposite.constructorOptions, expected)
	}

	@test()
	protected static async canSetAndGetCanvasClass() {
		PpgGrapher.CanvasClass = SpyCanvas
		assert.isEqual(PpgGrapher.CanvasClass, SpyCanvas)
	}

	@test()
	protected static async canSetAndGetCompositeClass() {
		PpgGrapher.CompositeClass = SpyComposite
		assert.isEqual(PpgGrapher.CompositeClass, SpyComposite)
	}

	private static generateRequiredCanvasOptions(
		title: string,
		datasets: Dataset[]
	) {
		return {
			type: 'line',
			data: {
				labels: [],
				datasets: datasets.map(({ label, data }) => {
					return {
						label,
						data,
						fill: false,
					}
				}),
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: title,
						font: {
							size: 16,
						},
						padding: {
							top: 10,
							bottom: 30,
						},
					},
				},
			},
		}
	}

	private static generateRandomArray(length: number) {
		return Array.from({ length }, () => Math.random())
	}

	protected static async run() {
		await this.grapher.run(this.savePath, this.signals)
	}

	private static Grapher() {
		return new SpyPpgGrapher()
	}

	private static get expectedOptions() {
		return [
			{
				title: 'Raw PPG Data',
				datasets: [{ label: 'Raw PPG Data', data: this.signals.rawData }],
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
					{ label: 'Raw PPG Data', data: this.signals.rawData },
					{ label: 'Lower Envelope', data: this.signals.lowerEnvelope },
				],
			},
		]
	}
}
