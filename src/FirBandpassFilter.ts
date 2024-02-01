import { assertOptions } from '@sprucelabs/schema'
import {
	FirCoeffs as FiliFirCoeffs,
	FirFilter as FiliFirFilter,
	FiliFirFilterClass,
} from '@neurodevs/fili'
import {
	assertArrayIsNotEmpty,
	assertHighFreqGreaterThanLowFreq,
	assertValidAttenuation,
	assertValidHighCutoffHz,
	assertValidLowCutoffHz,
	assertValidNumTaps,
	assertValidSampleRate,
} from './assertions'
import {
	normalizeArray,
	padArrayWithZeros,
	removeArrayPadding,
} from './preprocess'
import {
	Filter,
	FirBandpassFilterOptions,
} from './types/nodeSignalProcessing.types'

export default class FirBandpassFilter implements Filter {
	private sampleRate: number
	private lowCutoffHz: number
	private highCutoffHz: number
	private numTaps: number
	private attenuation: number
	protected useNormalization: boolean
	protected usePadding: boolean

	public static FiliFilterClass: FiliFirFilterClass = FiliFirFilter
	private filiFilter: FiliFirFilter

	public constructor(options: FirBandpassFilterOptions) {
		const {
			sampleRate,
			lowCutoffHz,
			highCutoffHz,
			numTaps,
			attenuation,
			useNormalization = true,
			usePadding = true,
		} = assertOptions(options, [
			'sampleRate',
			'lowCutoffHz',
			'highCutoffHz',
			'numTaps',
			'attenuation',
		])

		assertValidSampleRate(sampleRate)
		assertValidLowCutoffHz(lowCutoffHz)
		assertValidHighCutoffHz(highCutoffHz)
		assertHighFreqGreaterThanLowFreq(lowCutoffHz, highCutoffHz)
		assertValidNumTaps(numTaps)
		assertValidAttenuation(attenuation)

		this.sampleRate = sampleRate
		this.lowCutoffHz = lowCutoffHz
		this.highCutoffHz = highCutoffHz
		this.numTaps = numTaps
		this.attenuation = attenuation
		this.useNormalization = useNormalization
		this.usePadding = usePadding

		this.filiFilter = this.load()
	}

	public run(data: number[]) {
		assertArrayIsNotEmpty(data)
		this.filiFilter.reinit()

		if (this.useNormalization) {
			data = normalizeArray(data)
		}

		let result

		if (this.usePadding) {
			const padLength = 3 * this.numTaps
			const padded = padArrayWithZeros(data, padLength)
			const resultPadded = this.filiFilter.filtfilt(padded)
			result = removeArrayPadding(resultPadded, padLength)
		} else {
			result = this.filiFilter.filtfilt(data)
		}

		return result
	}

	protected load() {
		let firCoeffsCalculator = new FiliFirCoeffs()

		let firFilterCoeffs = firCoeffsCalculator.kbFilter({
			Fs: this.sampleRate,
			Fa: this.lowCutoffHz,
			Fb: this.highCutoffHz,
			order: this.numTaps,
			Att: this.attenuation,
		})

		return new FirBandpassFilter.FiliFilterClass(firFilterCoeffs)
	}
}
