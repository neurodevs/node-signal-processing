import {
    DetectPeaksFn,
    DetectPeaksOptions,
    DetectPeaksResults,
} from '../../impl/detectPeaks.js'

export function createFakeDetectPeaks(fakeResult = createEmptyResult()) {
    const fake = ((filteredSignal, timestamps, options) => {
        fake.calledWith.push({ filteredSignal, timestamps, options })
        return fake.fakeResult
    }) as FakeDetectPeaks

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
    } as DetectPeaksResults
}

export interface FakeDetectPeaks extends DetectPeaksFn {
    calledWith: CallToDetectPeaks[]
    fakeResult: DetectPeaksResults
}

export interface CallToDetectPeaks {
    filteredSignal: readonly number[]
    timestamps: readonly number[]
    options?: DetectPeaksOptions
}
