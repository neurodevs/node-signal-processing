import { isPowerOfTwo } from '../utils/validations.js'
import { hilbertTransform, HilbertTransformFn } from './hilbertTransform.js'

export function detectHilbertPeaks(
    filteredSignal: readonly number[],
    timestamps: readonly number[],
    options: DetectHilbertPeaksOptions = {}
): HilbertPeakResults {
    const { hilbertTransform: transform = hilbertTransform } = options

    const padding = createPadding(filteredSignal.length)
    const paddedSignal = padSignal(filteredSignal, padding)

    const removePadding = (signal: readonly number[]) =>
        removePaddingFromSignal(signal, padding, paddedSignal.length)

    const upperHilbert = transform(paddedSignal)
    const lowerHilbert = transform(upperHilbert.analyticSignal)

    const thresholdedSignal = setSignalBelowLowerEnvelopeToZero(
        filteredSignal,
        removePadding(paddedSignal),
        lowerHilbert.envelope
    )

    const nonZeroSegments = extractNonZeroSegments(
        thresholdedSignal,
        timestamps
    )

    const peaks = detectPeaks(nonZeroSegments)

    return {
        filteredSignal,
        timestamps,
        upperAnalyticSignal: removePadding(upperHilbert.analyticSignal),
        upperEnvelope: removePadding(upperHilbert.envelope),
        lowerAnalyticSignal: removePadding(lowerHilbert.analyticSignal),
        lowerEnvelope: removePadding(lowerHilbert.envelope),
        thresholdedSignal,
        nonZeroSegments,
        peaks,
    } as unknown as HilbertPeakResults
}

function createPadding(signalLength: number) {
    if (isPowerOfTwo(signalLength)) {
        return { numZerosAtStart: 0, numZerosAtEnd: 0 }
    }

    const totalZerosToPad = nextPowerOfTwo(signalLength) - signalLength
    const numZerosAtStart = Math.floor(totalZerosToPad / 2)

    return {
        numZerosAtStart,
        numZerosAtEnd: totalZerosToPad - numZerosAtStart,
    }
}

function nextPowerOfTwo(signalLength: number) {
    const level = Math.log2(signalLength)
    return Math.pow(2, Math.ceil(level))
}

function padSignal(signal: readonly number[], padding: Padding) {
    const { numZerosAtStart, numZerosAtEnd } = padding

    return [
        ...createZeros(numZerosAtStart),
        ...signal,
        ...createZeros(numZerosAtEnd),
    ]
}

function createZeros(numZeros: number) {
    return Array(numZeros).fill(0) as number[]
}

function removePaddingFromSignal(
    signal: readonly number[],
    padding: Padding,
    paddedSignalLength: number
) {
    const { numZerosAtStart, numZerosAtEnd } = padding
    return signal.slice(numZerosAtStart, paddedSignalLength - numZerosAtEnd)
}

function setSignalBelowLowerEnvelopeToZero(
    filteredSignal: readonly number[],
    unpaddedSignal: readonly number[],
    lowerEnvelope: readonly number[]
) {
    const thresholdedSignal = filteredSignal.slice()

    for (let i = 0; i < filteredSignal.length; i++) {
        if (lowerEnvelope[i] > unpaddedSignal[i]) {
            thresholdedSignal[i] = 0
        }
    }

    return thresholdedSignal
}

function extractNonZeroSegments(
    thresholdedSignal: readonly number[],
    timestamps: readonly number[]
) {
    const nonZeroSegments: SignalSegment[] = []

    let currentSegment = createEmptySegment()

    for (let i = 0; i < thresholdedSignal.length; i++) {
        const value = thresholdedSignal[i]
        const timestamp = timestamps[i]

        if (value !== 0) {
            currentSegment.values.push(value)
            currentSegment.timestamps.push(timestamp)
        } else {
            if (currentSegment.values.length > 0) {
                nonZeroSegments.push(currentSegment)
                currentSegment = createEmptySegment()
            }
        }
    }

    if (currentSegment.values.length > 0) {
        nonZeroSegments.push(currentSegment)
    }

    return nonZeroSegments
}

function createEmptySegment(): SignalSegment {
    return {
        values: [],
        timestamps: [],
    }
}

function detectPeaks(nonZeroSegments: SignalSegment[]) {
    const peaks: DataPoint[] = []

    for (const segment of nonZeroSegments) {
        const { values, timestamps } = segment

        const maxValue = Math.max(...values)
        const indexAtMaxValue = values.findIndex((v) => v == maxValue)
        const timestampAtMaxValue = timestamps[indexAtMaxValue]

        peaks.push({
            timestamp: timestampAtMaxValue,
            value: maxValue,
        })
    }

    return peaks
}

export type DetectHilbertPeaksFn = (
    filteredSignal: readonly number[],
    timestamps: readonly number[],
    options?: DetectHilbertPeaksOptions
) => HilbertPeakResults

export interface DetectHilbertPeaksOptions {
    hilbertTransform?: HilbertTransformFn
}

export interface HilbertPeakResults {
    filteredSignal: number[]
    timestamps: number[]
    upperAnalyticSignal: number[]
    upperEnvelope: number[]
    lowerAnalyticSignal: number[]
    lowerEnvelope: number[]
    thresholdedSignal: number[]
    nonZeroSegments: SignalSegment[]
    peaks: DataPoint[]
}

export interface SignalSegment {
    values: number[]
    timestamps: number[]
}

export interface DataPoint {
    value: number
    timestamp: number
}

interface Padding {
    numZerosAtStart: number
    numZerosAtEnd: number
}
