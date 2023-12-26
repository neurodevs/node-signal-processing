import FirBandpassFilter, {
	FirBandpassFilterOptions,
	RunOptions,
} from '../../FirBandpassFilter'

export default class SpyFirBandpassFilter extends FirBandpassFilter {
	public static constructorHitCount = 0
	public static runHitCount = 0

	public static clear() {
		SpyFirBandpassFilter.constructorHitCount = 0
		SpyFirBandpassFilter.runHitCount = 0
	}

	public constructor(options: FirBandpassFilterOptions) {
		SpyFirBandpassFilter.constructorHitCount++
		super(options)
	}

	public load(): any {
		return super.load()
	}

	public run(data: number[], options?: Partial<RunOptions>) {
		SpyFirBandpassFilter.runHitCount++
		return super.run(data, options)
	}

	public getSampleRate() {
		return this.sampleRate
	}

	public getLowCutoffHz() {
		return this.lowCutoffHz
	}

	public getHighCutoffHz() {
		return this.highCutoffHz
	}

	public getNumTaps() {
		return this.numTaps
	}

	public getAttenuation() {
		return this.attenuation
	}
}
