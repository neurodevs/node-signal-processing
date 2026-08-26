import {
    assertArrayIsNotEmpty,
    assertArrayLengthIsPowerOfTwo,
} from '../utils/assertions.js'
import Fft, { ComplexNumbers, FastFourierTransform } from './Fft.js'

export function hilbertTransform(
    signal: readonly number[],
    options?: HilbertTransformOptions
): HilbertTransformResults {
    const { createFft = defaultCreateFft } = options ?? {}

    const copiedSignal = signal.slice()
    assertValidSignal(copiedSignal)

    const fft = createFft(copiedSignal.length)

    const freqs = runForwardFft(fft, copiedSignal)
    const filter = createHilbertFilter(copiedSignal.length)
    const filtered = applyFilterToFreqs(freqs, filter)
    const result = fft.inverse(filtered)

    return createResults(result)
}

function assertValidSignal(signal: readonly number[]) {
    assertArrayIsNotEmpty(signal)
    assertArrayLengthIsPowerOfTwo(signal)
}

function runForwardFft(fft: FastFourierTransform, signal: number[]) {
    const freqs = fft.forward(signal)

    return {
        real: freqs.real.slice(),
        imaginary: freqs.imaginary.slice(),
    } satisfies ComplexNumbers
}

function createHilbertFilter(signalLength: number) {
    const filter = new Array(signalLength).fill(0)

    if (signalLength % 2 == 0) {
        updateFilterForEvenLength(filter, signalLength)
    } else {
        updateFilterForOddLength(filter, signalLength)
    }

    return filter
}

function updateFilterForEvenLength(filter: number[], signalLength: number) {
    doublePositiveFrequencies(filter, signalLength / 2)
    setDcComponentToZero(filter)
    setNyquistFrequencyToZero(filter, signalLength)
}

function updateFilterForOddLength(filter: number[], signalLength: number) {
    doublePositiveFrequencies(filter, (signalLength + 1) / 2)
    setDcComponentToZero(filter)
}

function doublePositiveFrequencies(filter: number[], numFrequencies: number) {
    for (let i = 1; i < numFrequencies; i++) {
        filter[i] = 2
    }
}

function setDcComponentToZero(filter: number[]) {
    filter[0] = 0
}

function setNyquistFrequencyToZero(filter: number[], signalLength: number) {
    filter[signalLength / 2] = 0
}

function applyFilterToFreqs(freqs: ComplexNumbers, filter: number[]) {
    const { real, imaginary } = freqs

    for (let i = 0; i < filter.length; i++) {
        real[i] *= filter[i]
        imaginary[i] *= filter[i]
    }

    return { real, imaginary } satisfies ComplexNumbers
}

function createResults(result: ComplexNumbers) {
    const analyticSignal = result.imaginary
    const envelope = analyticSignal.map((value) => Math.abs(value))

    return { analyticSignal, envelope } satisfies HilbertTransformResults
}

function defaultCreateFft(radix: number) {
    return Fft.Create({ radix })
}

export type HilbertTransformFn = (
    signal: readonly number[],
    options?: HilbertTransformOptions
) => HilbertTransformResults

export interface HilbertTransformOptions {
    createFft?: FftFactory
}

export type FftFactory = (radix: number) => FastFourierTransform

export interface HilbertTransformResults {
    analyticSignal: number[]
    envelope: number[]
}
