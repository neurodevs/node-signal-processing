import HilbertPeakDetector, { SegmentData } from '../../HilbertPeakDetector'

export default class SpyHilbertPeakDetection extends HilbertPeakDetector {
	public static generateSegmentsHitCount = 0
	public static applyEnvelopeThresholdHitCount = 0
	public static findPeaksHitCount = 0

	public static clear() {
		SpyHilbertPeakDetection.generateSegmentsHitCount = 0
		SpyHilbertPeakDetection.applyEnvelopeThresholdHitCount = 0
		SpyHilbertPeakDetection.findPeaksHitCount = 0
	}

	public generateSegments(thresholdedData: number[], timestamps: number[]) {
		SpyHilbertPeakDetection.generateSegmentsHitCount++
		return super.generateSegments(thresholdedData, timestamps)
	}

	public applyEnvelopeThreshold(
		filteredData: number[],
		lowerEnvelope: number[]
	) {
		SpyHilbertPeakDetection.applyEnvelopeThresholdHitCount++
		return super.applyEnvelopeThreshold(filteredData, lowerEnvelope)
	}

	public findPeaks(segmentedData: SegmentData) {
		SpyHilbertPeakDetection.findPeaksHitCount++
		return super.findPeaks(segmentedData)
	}
}
