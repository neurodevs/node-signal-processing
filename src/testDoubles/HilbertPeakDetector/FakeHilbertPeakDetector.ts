import {
    PeakDetector,
    PeakDetectorResults,
} from '../../impl/HilbertPeakDetector.js'
import { HilbertTransformFn } from '../../impl/hilbertTransform.js'

export default class FakeHilbertPeakDetector implements PeakDetector {
    public static constructorCalledWith: HilbertTransformFn[] = []
    public static runCalledWith: CallToRun[] = []

    public static fakeRunResult = this.createEmptyResult()

    public transform: HilbertTransformFn

    public constructor(transform: HilbertTransformFn) {
        this.transform = transform
        this.constructorCalledWith.push(transform)
    }

    public run(
        filteredSignal: readonly number[],
        timestamps: readonly number[]
    ) {
        this.runCalledWith.push({
            filteredSignal,
            timestamps,
        })
        return this.fakeRunResult
    }

    public get constructorCalledWith() {
        return FakeHilbertPeakDetector.constructorCalledWith
    }

    public get runCalledWith() {
        return FakeHilbertPeakDetector.runCalledWith
    }

    public get fakeRunResult() {
        return FakeHilbertPeakDetector.fakeRunResult
    }

    private static createEmptyResult() {
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
        } as PeakDetectorResults
    }

    public static resetTestDouble() {
        this.constructorCalledWith = []
        this.runCalledWith = []
    }
}

export interface CallToRun {
    filteredSignal: readonly number[]
    timestamps: readonly number[]
}
