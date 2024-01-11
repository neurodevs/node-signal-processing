import { assertOptions } from '@sprucelabs/schema'
import { Fft as FiliFft } from '@neurodevs/fili'
import { assertValidDataLength as assertValidDataLength } from './assertions'

export default class FastFourierTransform {
	protected radix: number
	private fft: FiliFft

	public constructor(options: FastFourierTransformOptions) {
		const { radix } = assertOptions(options, ['radix'])
		// assertValidRadix(radix)
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

export type FastFourierTransformClass = new (
	options: FastFourierTransformOptions
) => FastFourierTransform

export interface FastFourierTransformOptions {
	radix: number
}

export interface ComplexNumbers {
	real: number[]
	imaginary: number[]
}
