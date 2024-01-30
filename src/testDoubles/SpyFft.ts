import Fft from '../FastFourierTransform'
import { FftOptions, ComplexNumbers } from '../types/nodeSignalProcessing.types'

export default class SpyFft extends Fft {
	public static constructorHitCount = 0
	public static forwardHitCount = 0
	public static inverseHitCount = 0

	public constructor(options: FftOptions) {
		super(options)
		SpyFft.constructorHitCount += 1
	}

	public getRadix() {
		return this.radix
	}

	public load() {
		return super.load()
	}

	public forward(data: number[]): ComplexNumbers {
		SpyFft.forwardHitCount += 1
		return super.forward(data)
	}

	public inverse(data: ComplexNumbers): ComplexNumbers {
		SpyFft.inverseHitCount += 1
		return super.inverse(data)
	}

	public static clear() {
		SpyFft.constructorHitCount = 0
		SpyFft.forwardHitCount = 0
		SpyFft.inverseHitCount = 0
	}
}
