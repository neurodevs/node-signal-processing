import {
    assertArrayIsNotEmpty,
    assertArrayLengthIsPowerOfTwo,
} from './assertions'
import Fft, { FastFourierTransform } from './Fft'

export default class HilbertTransformer implements HilbertTransform {
    public static Class?: HilbertTransformConstructor

    private data!: number[]
    private fft!: FastFourierTransform

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public run(data: number[]) {
        this.data = data
        this.assertValidData()

        this.fft = this.Fft(data.length)

        const freqs = this.fft.forward(this.data)

        const real = freqs.real.slice()
        const imaginary = freqs.imaginary.slice()

        // Construct h filter for Hilbert transform (scaling)
        const N = real.length
        const h = new Array(N).fill(0)

        // Define scaling for positive frequencies (1 for first half, 0 for second half)
        if (N % 2 == 0) {
            // Even length: 0 at both ends, 2 in the middle
            for (let i = 1; i < N / 2; i++) {
                h[i] = 2 // positive frequencies doubled
            }
            h[0] = 0 // DC component should be zero
            h[N / 2] = 0 // Nyquist frequency should be zero
        } else {
            // Odd length: no Nyquist frequency, 0 at the start, 2 up to the middle
            for (let i = 1; i < (N + 1) / 2; i++) {
                h[i] = 2 // positive frequencies doubled
            }
            h[0] = 0 // DC component should be zero
            // Note: The last element of h[] for odd N remains 0, which is correct
        }

        // Apply h filter and perform inverse FFT
        for (let i = 0; i < N; i++) {
            real[i] *= h[i]
            imaginary[i] *= h[i]
        }

        const result = this.fft.inverse({ real, imaginary })
        const analyticSignal = result.imaginary

        const envelope = analyticSignal.map((value) => Math.abs(value))

        return { analyticSignal, envelope }
    }

    private assertValidData() {
        assertArrayIsNotEmpty(this.data)
        assertArrayLengthIsPowerOfTwo(this.data)
    }

    private Fft(radix: number) {
        return Fft.Create({ radix })
    }
}

export interface HilbertTransform {
    run(data: number[]): HilbertTransformResults
}

export type HilbertTransformConstructor = new () => HilbertTransform

export interface HilbertTransformResults {
    analyticSignal: number[]
    envelope: number[]
}
