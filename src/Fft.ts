import { assertOptions } from '@sprucelabs/schema'
import { Fft as FiliFft } from 'fili'
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
		const result = this.fft.forward(data, 'none')
		return {
			real: result.re,
			imaginary: result.im,
		}
	}

	public inverse(data: ComplexNumbers): ComplexNumbers {
		assertValidDataLength(data.real, this.radix)
		assertValidDataLength(data.imaginary, this.radix)
		const result = this.fft.inverse(data.real, data.imaginary)
		return {
			real: result.re,
			imaginary: result.im,
		}
	}

	protected load(): FiliFft {
		return new FiliFft(this.radix)
	}
}

export interface FftOptions {
	radix: number
}

export type FftClass = new (options: FftOptions) => Fft

export interface ComplexNumbers {
	real: number[]
	imaginary: number[]
}
