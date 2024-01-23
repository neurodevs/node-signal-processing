import { assertOptions } from '@sprucelabs/schema'
import { ChartConfiguration } from 'chart.js'
import Canvas from './Canvas'
import Composite from './Composite'
import { PpgPeakDetectorResults } from './PpgPeakDetector'

export default class PpgGrapher implements Grapher {
	public static CanvasClass = Canvas
	public static CompositeClass = Composite

	public async run(savePath: string, signals: PpgPeakDetectorResults) {
		assertOptions({ savePath, signals }, ['savePath', 'signals'])

		const graphConfigs = this.generateGraphConfigs(signals)

		const subplots = await Promise.all(
			graphConfigs.map((config) => this.createSubplot(config))
		)

		await this.combineSubplots({ subplots })
	}

	protected async createSubplot(options: CreateSubplotOptions) {
		const { title, datasets } = options

		const width = 800
		const height = 300

		const canvas = new PpgGrapher.CanvasClass({ width, height })

		const configuration: ChartConfiguration = {
			type: 'line',
			data: {
				datasets: datasets.map((dataset) => {
					return {
						label: dataset.label,
						data: dataset.data.slice(),
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

		return canvas.render({ configuration })
	}

	protected async combineSubplots(_options: CombineSubplotOptions) {
		new PpgGrapher.CompositeClass({
			create: {
				width: 800,
				height: 300 * 7,
				channels: 4,
				background: { r: 255, g: 255, b: 255, alpha: 0 },
			},
		})
	}

	private generateGraphConfigs(signals: PpgPeakDetectorResults) {
		return [
			{
				title: 'Raw PPG Data',
				datasets: [{ label: 'Raw PPG Data', data: signals.rawData }],
			},
			{
				title: 'Filtered PPG Data (0.4-4 Hz Bandpass)',
				datasets: [{ label: 'Filtered PPG Data', data: signals.filteredData }],
			},
			{
				title: 'Upper Envelope (Hilbert)',
				datasets: [
					{ label: 'Filtered PPG Data', data: signals.filteredData },
					{ label: 'Upper Envelope', data: signals.upperEnvelope },
				],
			},
			{
				title: 'Lower Envelope (Hilbert)',
				datasets: [
					{ label: 'Filtered PPG Data', data: signals.filteredData },
					{ label: 'Upper Envelope', data: signals.upperEnvelope },
					{ label: 'Lower Envelope', data: signals.lowerEnvelope },
				],
			},
			{
				title: 'Thresholded PPG Data by Lower Envelope',
				datasets: [
					{ label: 'Thresholded PPG Data', data: signals.thresholdedData },
					{ label: 'Lower Envelope', data: signals.lowerEnvelope },
				],
			},
			{
				title: 'Peak Detection',
				datasets: [
					{ label: 'Thresholded PPG Data', data: signals.thresholdedData },
					{ label: 'Lower Envelope', data: signals.lowerEnvelope },
				],
			},
			{
				title: 'Peak Detection on Raw Data',
				datasets: [
					{ label: 'Raw PPG Data', data: signals.rawData },
					{ label: 'Lower Envelope', data: signals.lowerEnvelope },
				],
			},
		]
	}
}

export interface Grapher {
	run(savePath: string, signals: PpgPeakDetectorResults): void
}

export interface CreateSubplotOptions {
	title: string
	datasets: Dataset[]
}

export interface CombineSubplotOptions {
	subplots: any
}

export interface Dataset {
	label: string
	data: number[]
}
