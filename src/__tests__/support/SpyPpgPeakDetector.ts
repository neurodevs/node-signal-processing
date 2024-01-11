import PpgPeakDetector, { PpgPeakDetectorOptions } from '../../PpgPeakDetector'

export default class SpyPpgPeakDetector extends PpgPeakDetector {
	public static constructorHitCount = 0

	public static clear() {
		SpyPpgPeakDetector.constructorHitCount = 0
	}

	public constructor(options: PpgPeakDetectorOptions) {
		SpyPpgPeakDetector.constructorHitCount += 1
		super(options)
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

	public getFilter() {
		return this.filter
	}
}
