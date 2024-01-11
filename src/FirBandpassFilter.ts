import { assertOptions } from '@sprucelabs/schema'
import {
	FirCoeffs as FiliFirCoeffs,
	FirFilter as FiliFirFilter,
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

export default class FirBandpassFilter {
	protected sampleRate: number
	protected lowCutoffHz: number
	protected highCutoffHz: number
	protected numTaps: number
	protected attenuation: number

	private filter: FiliFirFilter

	public constructor(options: FirBandpassFilterOptions) {
		const { sampleRate, lowCutoffHz, highCutoffHz, numTaps, attenuation } =
			assertOptions(options, [
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

		this.filter = this.load()
	}

	public run(
		data: number[],
		options: RunOptions = { usePadding: true, useNormalization: true } || null
	): number[] {
		assertArrayIsNotEmpty(data)
		let { usePadding = true, useNormalization = true } = options
		this.filter.reinit()

		if (useNormalization) {
			data = normalizeArray(data)
		}

		let result

		if (usePadding) {
			const padLength = 3 * this.numTaps
			const padded = padArrayWithZeros(data, padLength)
			const resultPadded = this.filter.filtfilt(padded)
			result = removeArrayPadding(resultPadded, padLength)
		} else {
			result = this.filter.filtfilt(data)
		}

		return result
	}

	protected load(): FiliFirFilter {
		let firCoeffsCalculator = new FiliFirCoeffs()

		let firFilterCoeffs = firCoeffsCalculator.kbFilter({
			Fs: this.sampleRate,
			Fa: this.lowCutoffHz,
			Fb: this.highCutoffHz,
			order: this.numTaps,
			Att: this.attenuation,
		})

		return new FiliFirFilter(firFilterCoeffs)
	}
}

export type FirBandpassFilterClass = new (
	options: FirBandpassFilterOptions
) => FirBandpassFilter

export interface FirBandpassFilterOptions {
	sampleRate: number
	lowCutoffHz: number
	highCutoffHz: number
	numTaps: number
	attenuation: number
}

export interface RunOptions {
	usePadding?: boolean
	useNormalization?: boolean
}
