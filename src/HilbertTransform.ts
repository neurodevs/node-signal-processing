import {
	assertArrayIsNotEmpty,
	assertArrayLengthIsPowerOfTwo,
} from './assertions'
import Fft, { FastFourierTransformClass } from './FastFourierTransform'

export default class HilbertTransform {
	private static FftClass: FastFourierTransformClass = Fft

	public static setFftClass(Class: FastFourierTransformClass): void {
		HilbertTransform.FftClass = Class
	}

	public static getFftClass(): FastFourierTransformClass {
		return HilbertTransform.FftClass
	}

	public run(data: number[]): number[] {
		assertArrayIsNotEmpty(data)
		assertArrayLengthIsPowerOfTwo(data)

		const fft = new HilbertTransform.FftClass({ radix: data.length })

		const freqs = fft.forward(data)

		const real = freqs.real.slice()
		const imag = freqs.imaginary.slice()

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
			imag[i] *= h[i]
		}

		const result = fft.inverse({ real, imaginary: imag })
		const analyticSignal = result.imaginary

		return analyticSignal
	}

	public getEnvelope(analyticSignal: number[]) {
		return analyticSignal.map((value) => Math.abs(value))
	}
}

export type HilbertTransformClass = new () => HilbertTransform
