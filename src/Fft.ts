import { assertOptions } from '@sprucelabs/schema'
import { ComplexNumbers, Fft as FiliFft } from 'fili'
import {
	assertValidDataLength as assertValidDataLength,
	assertValidRadix,
} from './assertions'

export default class Fft {
	protected radix: number
	private fft: FiliFft

	public constructor(options: FftOptions) {
		const { radix } = assertOptions(options, ['radix'])
		assertValidRadix(radix)
		this.radix = radix
		this.fft = this.load()
	}

	public forward(data: number[]): ComplexNumbers {
		assertValidDataLength(data, this.radix)
		return this.fft.forward(data, 'none')
	}

	public inverse(data: ComplexNumbers): ComplexNumbers {
		assertValidDataLength(data.re, this.radix)
		assertValidDataLength(data.im, this.radix)
		const result = this.fft.inverse(data.re, data.im)
		return { re: Array.from(result), im: Array.from(result) }
	}

	protected load(): FiliFft {
		return new FiliFft(this.radix)
	}
}

export interface FftOptions {
	radix: number
}

export type FftClass = new (options: FftOptions) => Fft
