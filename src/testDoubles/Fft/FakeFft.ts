import {
    ComplexNumbers,
    FastFourierTransform,
    FftOptions,
} from '../../components/Fft'

export default class FakeFft implements FastFourierTransform {
    public static constructorCalledWith: FftOptions[] = []
    public static forwardCalledWith: number[][] = []
    public static inverseCalledWith: ComplexNumbers[] = []

    public static fakeForwardResult = this.createEmptyResult()
    public static fakeInverseResult = this.createEmptyResult()

    public constructor(options: FftOptions) {
        this.constructorCalledWith.push(options)
    }

    public forward(signal: number[]) {
        this.forwardCalledWith.push(signal)
        return this.fakeForwardResult
    }

    public inverse(signal: ComplexNumbers) {
        this.inverseCalledWith.push(signal)
        return this.fakeInverseResult
    }

    public get constructorCalledWith() {
        return FakeFft.constructorCalledWith
    }

    public get forwardCalledWith() {
        return FakeFft.forwardCalledWith
    }

    public get inverseCalledWith() {
        return FakeFft.inverseCalledWith
    }

    public get fakeForwardResult() {
        return FakeFft.fakeForwardResult
    }

    public get fakeInverseResult() {
        return FakeFft.fakeInverseResult
    }

    private static createEmptyResult() {
        return {
            real: [],
            imaginary: [],
        } as ComplexNumbers
    }

    public static resetTestDouble() {
        this.constructorCalledWith = []
        this.forwardCalledWith = []
        this.inverseCalledWith = []
    }
}
