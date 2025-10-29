import {
    FirBandpassFilterOptions,
    Filter,
} from '../../impl/FirBandpassFilter.js'

export default class FakeFirBandpassFilter implements Filter {
    public static constructorCalledWith: FirBandpassFilterOptions[] = []
    public static runCalledWith: number[][] = []

    public static fakeRunResult = this.createEmptyResult()

    public constructor(options: FirBandpassFilterOptions) {
        this.constructorCalledWith.push(options)
    }

    public run(signal: number[]) {
        this.runCalledWith.push(signal)
        return FakeFirBandpassFilter.fakeRunResult
    }

    public get constructorCalledWith() {
        return FakeFirBandpassFilter.constructorCalledWith
    }

    public get runCalledWith() {
        return FakeFirBandpassFilter.runCalledWith
    }

    public get fakeRunResult() {
        return FakeFirBandpassFilter.fakeRunResult
    }

    private static createEmptyResult() {
        return [] as number[]
    }

    public static resetTestDouble() {
        this.constructorCalledWith = []
        this.runCalledWith = []
    }
}
