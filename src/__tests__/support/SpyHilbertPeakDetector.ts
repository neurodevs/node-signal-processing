import HilbertPeakDetector from '../../HilbertPeakDetector'
import { SegmentData } from '../../types/nodeSignalProcessing.types'

export default class SpyHilbertPeakDetector extends HilbertPeakDetector {
	public static generateSegmentsHitCount = 0
	public static applyEnvelopeThresholdHitCount = 0
	public static findPeaksHitCount = 0

	public static clear() {
		SpyHilbertPeakDetector.generateSegmentsHitCount = 0
		SpyHilbertPeakDetector.applyEnvelopeThresholdHitCount = 0
		SpyHilbertPeakDetector.findPeaksHitCount = 0
	}

	public generateSegments(thresholdedData: number[], timestamps: number[]) {
		SpyHilbertPeakDetector.generateSegmentsHitCount++
		return super.generateSegments(thresholdedData, timestamps)
	}

	public applyEnvelopeThreshold(
		filteredData: number[],
		lowerEnvelope: number[]
	) {
		SpyHilbertPeakDetector.applyEnvelopeThresholdHitCount++
		return super.applyEnvelopeThreshold(filteredData, lowerEnvelope)
	}

	public findPeaks(segmentedData: SegmentData) {
		SpyHilbertPeakDetector.findPeaksHitCount++
		return super.findPeaks(segmentedData)
	}
}
