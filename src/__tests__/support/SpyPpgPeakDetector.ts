import PpgPeakDetector from '../../PpgPeakDetector'

export default class SpyPpgPeakDetector extends PpgPeakDetector {
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
