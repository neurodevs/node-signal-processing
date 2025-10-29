import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import { assertValidDataLength, assertValidRadix } from '../utils/assertions.js'

const { Fft: FiliFft } = require('@neurodevs/fili')

export default class Fft implements FastFourierTransform {
    public static Class?: FftConstructor

    private filiFft: typeof FiliFft
    private radix: number

    protected constructor(options: FftOptions) {
        const { radix } = options
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
        const { real, imaginary } = signal
        assertValidDataLength(real, this.radix)
        assertValidDataLength(imaginary, this.radix)

        const result = this.filiFft.inverse(real, imaginary)

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
