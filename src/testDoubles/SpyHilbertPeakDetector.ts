import HilbertPeakDetector, { SegmentData } from '../HilbertPeakDetector'
import { HilbertTransform } from '../HilbertTransformer'

export default class SpyHilbertPeakDetector extends HilbertPeakDetector {
    public static generateSegmentsHitCount = 0
    public static applyEnvelopeThresholdHitCount = 0
    public static findPeaksHitCount = 0

    public constructor(transformer: HilbertTransform) {
        super(transformer)
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

    public static resetTestDouble() {
        this.generateSegmentsHitCount = 0
        this.applyEnvelopeThresholdHitCount = 0
        this.findPeaksHitCount = 0
    }
}
