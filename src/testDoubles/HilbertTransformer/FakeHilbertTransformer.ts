import {
    HilbertTransform,
    HilbertTransformResults,
} from '../../components/HilbertTransformer'

export default class FakeHilbertTransformer implements HilbertTransform {
    public static numCallsToConstructor = 0
    public static runCalledWith: number[][] = []

    public static fakeRunResult = this.createEmptyResult()

    public constructor() {
        FakeHilbertTransformer.numCallsToConstructor++
    }

    public run(signal: number[]) {
        FakeHilbertTransformer.runCalledWith.push(signal)
        return FakeHilbertTransformer.fakeRunResult
    }

    public get runCalledWith() {
        return FakeHilbertTransformer.runCalledWith
    }

    public get fakeRunResult() {
        return FakeHilbertTransformer.fakeRunResult
    }

    private static createEmptyResult() {
        return {
            analyticSignal: [],
            envelope: [],
        } as HilbertTransformResults
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
        this.runCalledWith = []
    }
}
