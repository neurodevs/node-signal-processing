import {
    PeakDetector,
    PeakDetectorResults,
} from '../../impl/HilbertPeakDetector.js'
import { HilbertTransform } from '../../impl/HilbertTransformer.js'

export default class FakeHilbertPeakDetector implements PeakDetector {
    public static constructorCalledWith: HilbertTransform[] = []
    public static runCalledWith: CallToRun[] = []

    public static fakeRunResult = this.createEmptyResult()

    public transformer: HilbertTransform

    public constructor(transformer: HilbertTransform) {
        this.transformer = transformer
        this.constructorCalledWith.push(transformer)
    }

    public run(filteredSignal: number[], timestamps: number[]) {
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
    filteredSignal: number[]
    timestamps: number[]
}
