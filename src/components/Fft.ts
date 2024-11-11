import { assertOptions } from '@sprucelabs/schema'
import { Fft as FiliFft } from '@neurodevs/fili'
import { assertValidDataLength, assertValidRadix } from '../utils/assertions'

export default class Fft implements FastFourierTransform {
    public static Class?: FftConstructor

    private filiFft: FiliFft
    private radix: number

    protected constructor(options: FftOptions) {
        const { radix } = assertOptions(options, ['radix'])
        assertValidRadix(radix)

        this.radix = radix
        this.filiFft = this.FiliFft()
    }

    public static Create(options: FftOptions) {
        return new (this.Class ?? this)(options)
    }

    public forward(signal: number[]) {
        assertValidDataLength(signal, this.radix)

        const result = this.filiFft.forward(signal, 'none')

        return {
            real: result.re,
            imaginary: result.im,
        }
    }

    public inverse(signal: ComplexNumbers) {
        assertValidDataLength(signal.real, this.radix)
        assertValidDataLength(signal.imaginary, this.radix)

        const result = this.filiFft.inverse(signal.real, signal.imaginary)

        return {
            real: result.re,
            imaginary: result.im,
        }
    }

    protected FiliFft() {
        return new FiliFft(this.radix)
    }
}
export interface FastFourierTransform {
    forward(signal: number[]): ComplexNumbers
    inverse(signal: ComplexNumbers): ComplexNumbers
}

export type FftConstructor = new (options: FftOptions) => FastFourierTransform

export interface FftOptions {
    radix: number
}

export interface ComplexNumbers {
    real: number[]
    imaginary: number[]
}
