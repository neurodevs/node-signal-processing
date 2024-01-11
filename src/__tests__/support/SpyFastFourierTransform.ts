import FastFourierTransform, {
	ComplexNumbers,
	FastFourierTransformOptions,
} from '../../FastFourierTransform'

export default class SpyFastFourierTransform extends FastFourierTransform {
	public static constructorHitCount = 0
	public static forwardHitCount = 0
	public static inverseHitCount = 0

	public constructor(options: FastFourierTransformOptions) {
		super(options)
		SpyFastFourierTransform.constructorHitCount += 1
	}

	public getRadix() {
		return this.radix
	}

	public load() {
		return super.load()
	}

	public forward(data: number[]): ComplexNumbers {
		SpyFastFourierTransform.forwardHitCount += 1
		return super.forward(data)
	}

	public inverse(data: ComplexNumbers): ComplexNumbers {
		SpyFastFourierTransform.inverseHitCount += 1
		return super.inverse(data)
	}

	public static clear() {
		SpyFastFourierTransform.constructorHitCount = 0
		SpyFastFourierTransform.forwardHitCount = 0
		SpyFastFourierTransform.inverseHitCount = 0
	}
}
