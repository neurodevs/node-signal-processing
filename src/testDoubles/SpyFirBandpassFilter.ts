import FirBandpassFilter from '../FirBandpassFilter'
import { FirBandpassFilterOptions } from '../types/nodeSignalProcessing.types'

export default class SpyFirBandpassFilter extends FirBandpassFilter {
	public static constructorHitCount = 0
	public static runHitCount = 0

	public static constructorCalledWith: FirBandpassFilterOptions[] = []
	public static runCalledWith: number[][] = []

	public static clear() {
		SpyFirBandpassFilter.constructorHitCount = 0
		SpyFirBandpassFilter.runHitCount = 0
	}

	public constructor(options: FirBandpassFilterOptions) {
		SpyFirBandpassFilter.constructorHitCount++
		SpyFirBandpassFilter.constructorCalledWith.push(options)
		super(options)
	}

	public run(data: number[]) {
		SpyFirBandpassFilter.runHitCount++
		SpyFirBandpassFilter.runCalledWith.push(data)
		return super.run(data)
	}

	public getUsePadding() {
		return this.usePadding
	}

	public getUseNormalization() {
		return this.useNormalization
	}
}
