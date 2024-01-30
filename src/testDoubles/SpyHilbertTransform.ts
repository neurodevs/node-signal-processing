import HilbertTransform from '../HilbertTransform'

export default class SpyHilbertTransform extends HilbertTransform {
	public static constructorHitCount = 0
	public static runHitCount = 0
	public static getEnvelopeHitCount = 0

	public static clear() {
		SpyHilbertTransform.constructorHitCount = 0
		SpyHilbertTransform.runHitCount = 0
		SpyHilbertTransform.getEnvelopeHitCount = 0
	}

	public constructor() {
		SpyHilbertTransform.constructorHitCount++
		super()
	}

	public run(data: number[]): number[] {
		SpyHilbertTransform.runHitCount++
		return super.run(data)
	}

	public getEnvelope(analyticSignal: number[]): number[] {
		SpyHilbertTransform.getEnvelopeHitCount++
		return super.getEnvelope(analyticSignal)
	}
}
