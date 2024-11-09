import { assertOptions } from '@sprucelabs/schema'
import { Fft as FiliFft } from '@neurodevs/fili'
import { assertValidDataLength, assertValidRadix } from './assertions'

export default class Fft implements FastFourierTransform {
    public static Class?: FftConstructor

    private filiFft: FiliFft
    private radix: number

    protected constructor(options: FftOptions) {
        const { radix } = assertOptions(options, ['radix'])
        assertValidRadix(radix)

        this.radix = radix
        this.filiFft = this.load()
    }

    public static Create(options: FftOptions) {
        return new (this.Class ?? this)(options)
    }

    public forward(data: number[]) {
        assertValidDataLength(data, this.radix)

        const result = this.filiFft.forward(data, 'none')

        return {
            real: result.re,
            imaginary: result.im,
        }
    }

    public inverse(data: ComplexNumbers) {
        assertValidDataLength(data.real, this.radix)
        assertValidDataLength(data.imaginary, this.radix)

        const result = this.filiFft.inverse(data.real, data.imaginary)

        return {
            real: result.re,
            imaginary: result.im,
        }
    }

    protected load() {
        return new FiliFft(this.radix)
    }
}
export interface FastFourierTransform {
    forward(data: number[]): ComplexNumbers
    inverse(data: ComplexNumbers): ComplexNumbers
}

export type FftConstructor = new (options: FftOptions) => FastFourierTransform

export interface FftOptions {
    radix: number
}

export interface ComplexNumbers {
    real: number[]
    imaginary: number[]
}
