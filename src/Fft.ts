import { assertOptions } from '@sprucelabs/schema'
import { Fft as FiliFft, FiliFftClass } from '@neurodevs/fili'
import { assertValidDataLength, assertValidRadix } from './assertions'
import {
    FastFourierTransform,
    FftOptions,
    ComplexNumbers,
} from './types/nodeSignalProcessing.types'

export default class Fft implements FastFourierTransform {
    private radix: number

    public static FiliFftClass: FiliFftClass = FiliFft
    private filiFft: FiliFft

    public constructor(options: FftOptions) {
        const { radix } = assertOptions(options, ['radix'])
        assertValidRadix(radix)
        this.radix = radix
        this.filiFft = this.load()
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
        return new Fft.FiliFftClass(this.radix)
    }
}
