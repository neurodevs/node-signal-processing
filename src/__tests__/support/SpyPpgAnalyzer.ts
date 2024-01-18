import PpgAnalyzerImpl from '../../PpgAnalyzer'

export default class SpyPpgAnalyzer extends PpgAnalyzerImpl {
	public getSampleRate() {
		return this.sampleRate
	}

	public getDetector() {
		return this.detector
	}

	public calculateHeartRateVariability(rrIntervals: number[]) {
		return super.calculateHeartRateVariability(rrIntervals)
	}
}
