import Fft, { ComplexNumbers, FftOptions } from '../Fft'

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

    public forward(data: number[]): ComplexNumbers {
        SpyFft.forwardHitCount += 1
        SpyFft.forwardCalledWith.push(data)
        return super.forward(data)
    }

    public inverse(data: ComplexNumbers): ComplexNumbers {
        SpyFft.inverseHitCount += 1
        SpyFft.inverseCalledWith.push(data)
        return super.inverse(data)
    }

    public static resetTestDouble() {
        SpyFft.constructorHitCount = 0
        SpyFft.forwardHitCount = 0
        SpyFft.inverseHitCount = 0
    }
}
