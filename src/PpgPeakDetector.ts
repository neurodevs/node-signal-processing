import { assertOptions } from '@sprucelabs/schema'
import FirBandpassFilter, { FirBandpassFilterClass } from './FirBandpassFilter'
import HilbertPeakDetector, { PeakDetectorResults } from './HilbertPeakDetector'

export default class PpgPeakDetector extends HilbertPeakDetector {
	protected sampleRate: number
	protected lowCutoffHz: number
	protected highCutoffHz: number
	protected numTaps: number
	protected attenuation: number

	protected filter: FirBandpassFilter
	private static FilterClass: FirBandpassFilterClass = FirBandpassFilter

	public static setFilterClass(Class: FirBandpassFilterClass): void {
		PpgPeakDetector.FilterClass = Class
	}

	public static getFilterClass(): FirBandpassFilterClass {
		return PpgPeakDetector.FilterClass
	}

	public constructor(options: PpgPeakDetectorOptions) {
		super()
		let {
			sampleRate,
			lowCutoffHz = 0.4,
			highCutoffHz = 4.0,
			numTaps = null,
			attenuation = 50,
		} = assertOptions(options, ['sampleRate'])

		if (!numTaps) {
			numTaps = 4 * Math.floor(sampleRate) + 1
		}

		this.sampleRate = sampleRate
		this.lowCutoffHz = lowCutoffHz
		this.highCutoffHz = highCutoffHz
		this.numTaps = numTaps
		this.attenuation = attenuation

		this.filter = new PpgPeakDetector.FilterClass({
			sampleRate,
			lowCutoffHz,
			highCutoffHz,
			numTaps,
			attenuation,
		})
	}

	public run(rawData: number[], timestamps: number[]) {
		const filtered = this.filter.run(rawData)
		const result = super.run(filtered, timestamps)
		return {
			...result,
			rawData,
		}
	}
}

export type PpgPeakDetectorClass = new (
	options: PpgPeakDetectorOptions
) => PpgPeakDetector

export interface PpgPeakDetectorOptions {
	sampleRate: number
	lowCutoffHz?: number
	highCutoffHz?: number
	numTaps?: number
	attenuation?: number
}

export interface PpgPeakDetectorResults extends PeakDetectorResults {
	rawData: number[]
}
