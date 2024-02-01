import HilbertTransformer from '../HilbertTransformer'

export default class SpyHilbertTransformer extends HilbertTransformer {
	public static constructorHitCount = 0
	public static runHitCount = 0

	public static clear() {
		SpyHilbertTransformer.constructorHitCount = 0
		SpyHilbertTransformer.runHitCount = 0
	}

	public constructor() {
		SpyHilbertTransformer.constructorHitCount++
		super()
	}

	public run(data: number[]) {
		SpyHilbertTransformer.runHitCount++
		return super.run(data)
	}
}
