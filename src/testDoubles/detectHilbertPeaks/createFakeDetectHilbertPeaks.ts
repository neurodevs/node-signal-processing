import {
    DetectHilbertPeaksFn,
    DetectHilbertPeaksOptions,
    HilbertPeakResults,
} from '../../impl/detectHilbertPeaks.js'

export function createFakeDetectHilbertPeaks(fakeResult = createEmptyResult()) {
    const fake = ((filteredSignal, timestamps, options) => {
        fake.calledWith.push({ filteredSignal, timestamps, options })
        return fake.fakeResult
    }) as FakeDetectHilbertPeaks

    fake.calledWith = []
    fake.fakeResult = fakeResult

    return fake
}

function createEmptyResult() {
    return {
        filteredSignal: [],
        timestamps: [],
        upperAnalyticSignal: [],
        upperEnvelope: [],
        lowerAnalyticSignal: [],
        lowerEnvelope: [],
        thresholdedSignal: [],
        nonZeroSegments: [],
        peaks: [],
    } as HilbertPeakResults
}

export interface FakeDetectHilbertPeaks extends DetectHilbertPeaksFn {
    calledWith: CallToDetectHilbertPeaks[]
    fakeResult: HilbertPeakResults
}

export interface CallToDetectHilbertPeaks {
    filteredSignal: readonly number[]
    timestamps: readonly number[]
    options?: DetectHilbertPeaksOptions
}
