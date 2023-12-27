import PpgAnalyzer from '../../PpgAnalyzer'

export default class SpyPpgAnalyzer extends PpgAnalyzer {
	public getSampleRate() {
		return this.sampleRate
	}

	public getDetector() {
		return this.detector
	}
}
