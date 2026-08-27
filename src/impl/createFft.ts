import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import { assertValidDataLength, assertValidRadix } from '../utils/assertions.js'

const { Fft: FiliFft } = require('@neurodevs/fili')

export function createFft(options: FftOptions): FastFourierTransform {
    const { radix } = options
    assertValidRadix(radix)

    const filiFft = new FiliFft(radix)

    return {
        forward(signal: readonly number[]) {
            assertValidDataLength(signal, radix)

            const result = filiFft.forward(signal, 'none')

            return {
                real: result.re,
                imaginary: result.im,
            }
        },

        inverse(signal: ComplexNumbers) {
            const { real, imaginary } = signal
            assertValidDataLength(real, radix)
            assertValidDataLength(imaginary, radix)

            const result = filiFft.inverse(real, imaginary)

            return {
                real: result.re,
                imaginary: result.im,
            }
        },
    }
}

export type FftFactory = (options: FftOptions) => FastFourierTransform

export interface FastFourierTransform {
    forward(signal: readonly number[]): ComplexNumbers
    inverse(signal: ComplexNumbers): ComplexNumbers
}

export interface FftOptions {
    radix: number
}

export interface ComplexNumbers {
    real: number[]
    imaginary: number[]
}
