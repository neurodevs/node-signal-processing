import Fft, { ComplexNumbers, FftOptions } from '../../components/Fft'

export default class SpyFft extends Fft {
    public static constructorHitCount = 0
    public static forwardHitCount = 0
    public static inverseHitCount = 0

    public static constructorCalledWith: FftOptions[] = []
    public static forwardCalledWith: number[][] = []
    public static inverseCalledWith: ComplexNumbers[] = []

    public constructor(options: FftOptions) {
        super(options)
        SpyFft.constructorHitCount += 1
        SpyFft.constructorCalledWith.push(options)
    }

    public forward(signal: number[]): ComplexNumbers {
        SpyFft.forwardHitCount += 1
        SpyFft.forwardCalledWith.push(signal)
        return super.forward(signal)
    }

    public inverse(signal: ComplexNumbers): ComplexNumbers {
        SpyFft.inverseHitCount += 1
        SpyFft.inverseCalledWith.push(signal)
        return super.inverse(signal)
    }

    public static resetTestDouble() {
        SpyFft.constructorHitCount = 0
        SpyFft.forwardHitCount = 0
        SpyFft.inverseHitCount = 0
    }
}
