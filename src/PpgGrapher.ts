import { assertOptions } from '@sprucelabs/schema'
import { PeakDetectorResults } from './HilbertPeakDetector'

export default class PpgGrapher implements Grapher {
	public async run(savePath: string, signals: PeakDetectorResults) {
		assertOptions({ savePath, signals }, ['savePath', 'signals'])

		const graphConfigs = [
			{
				title: 'Raw PPG Data',
				datasets: [{ label: 'Raw PPG Data', data: [] }],
			},
			{
				title: 'Filtered PPG Data (0.4-4 Hz Bandpass)',
				datasets: [{ label: 'Filtered PPG Data', data: [] }],
			},
			{
				title: 'Upper Envelope (Hilbert)',
				datasets: [
					{ label: 'Filtered PPG Data', data: [] },
					{ label: 'Upper Envelope', data: [] },
				],
			},
			{
				title: 'Lower Envelope (Hilbert)',
				datasets: [
					{ label: 'Filtered PPG Data', data: [] },
					{ label: 'Upper Envelope', data: [] },
					{ label: 'Lower Envelope', data: [] },
				],
			},
			{
				title: 'Thresholded PPG Data by Lower Envelope',
				datasets: [
					{ label: 'Thresholded PPG Data', data: [] },
					{ label: 'Lower Envelope', data: [] },
				],
			},
			{
				title: 'Peak Detection',
				datasets: [
					{ label: 'Thresholded PPG Data', data: [] },
					{ label: 'Lower Envelope', data: [] },
				],
			},
			{
				title: 'Peak Detection on Raw Data',
				datasets: [
					{ label: 'Raw PPG Data', data: [] },
					{ label: 'Lower Envelope', data: [] },
				],
			},
		]

		for (const graphConfig of graphConfigs) {
			await this.createSubplot(graphConfig)
		}
	}

	protected async createSubplot(_options: CreateSubplotOptions) {}
}

export interface Grapher {
	run(savePath: string, signals: PeakDetectorResults): void
}

export interface CreateSubplotOptions {
	title: string
}
