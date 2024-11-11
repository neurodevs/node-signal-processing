import HilbertTransformer from '../../components/HilbertTransformer'

export default class SpyHilbertTransformer extends HilbertTransformer {
    public static constructorHitCount = 0
    public static runHitCount = 0

    public constructor() {
        SpyHilbertTransformer.constructorHitCount++
        super()
    }

    public run(signal: number[]) {
        SpyHilbertTransformer.runHitCount++
        return super.run(signal)
    }

    public static resetTestDouble() {
        SpyHilbertTransformer.constructorHitCount = 0
        SpyHilbertTransformer.runHitCount = 0
    }
}
