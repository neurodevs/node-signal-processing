import { assertOptions } from '@sprucelabs/schema'
import FirBandpassFilter, { FilterClass } from './FirBandpassFilter'
import HilbertPeakDetector, { DataPoint } from './HilbertPeakDetector'

export default class PpgPeakDetector extends HilbertPeakDetector {
	protected sampleRate: number
	protected lowCutoffHz: number
	protected highCutoffHz: number
	protected numTaps: number
	protected attenuation: number

	protected filter: FirBandpassFilter
	private static filterClass: FilterClass = FirBandpassFilter

	public static setFilterClass(filterClass: FilterClass): void {
		PpgPeakDetector.filterClass = filterClass
	}

	public static getFilterClass(): FilterClass {
		return PpgPeakDetector.filterClass
	}

	public constructor(options: PpgPeakDetectorOptions) {
		super()
		const {
			sampleRate,
			lowCutoffHz = 0.4,
			highCutoffHz = 4.0,
			numTaps = 257,
			attenuation = 50,
		} = assertOptions(options, ['sampleRate'])

		this.sampleRate = sampleRate
		this.lowCutoffHz = lowCutoffHz
		this.highCutoffHz = highCutoffHz
		this.numTaps = numTaps
		this.attenuation = attenuation

		this.filter = new PpgPeakDetector.filterClass({
			sampleRate,
			lowCutoffHz,
			highCutoffHz,
			numTaps,
			attenuation,
		})
	}

	public run(data: number[], timestamps: number[]): DataPoint[] {
		const filtered = this.filter.run(data)
		return super.run(filtered, timestamps)
	}
}

export interface PpgPeakDetectorOptions {
	sampleRate: number
	lowCutoffHz?: number
	highCutoffHz?: number
	numTaps?: number
	attenuation?: number
}
