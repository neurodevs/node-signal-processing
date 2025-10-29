import HilbertPeakDetector from '../../impl/HilbertPeakDetector.js'
import { HilbertTransform } from '../../impl/HilbertTransformer.js'

export default class SpyHilbertPeakDetector extends HilbertPeakDetector {
    public static generateSegmentsHitCount = 0
    public static applyEnvelopeThresholdHitCount = 0
    public static findPeaksHitCount = 0

    public constructor(transformer: HilbertTransform) {
        super(transformer)
    }

    public setSignalBelowLowerEnvelopeToZero() {
        SpyHilbertPeakDetector.applyEnvelopeThresholdHitCount++
        return super.setSignalBelowLowerEnvelopeToZero()
    }

    public extractNonZeroSegments() {
        SpyHilbertPeakDetector.generateSegmentsHitCount++
        return super.extractNonZeroSegments()
    }

    public detectPeaks() {
        SpyHilbertPeakDetector.findPeaksHitCount++
        return super.detectPeaks()
    }

    public static resetTestDouble() {
        this.generateSegmentsHitCount = 0
        this.applyEnvelopeThresholdHitCount = 0
        this.findPeaksHitCount = 0
    }
}
