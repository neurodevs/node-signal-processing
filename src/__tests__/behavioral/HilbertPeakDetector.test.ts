import { test, assert } from '@sprucelabs/test-utils'
import HilbertPeakDetector from '../../HilbertPeakDetector'
import SpyHilbertPeakDetector from '../../testDoubles/SpyHilbertPeakDetector'
import SpyHilbertTransformer from '../../testDoubles/SpyHilbertTransformer'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'

export default class HilbertPeakDetectorTest extends AbstractSignalProcessingTest {
    private static detector: HilbertPeakDetector

    protected static async beforeEach() {
        HilbertPeakDetector.TransformerClass = SpyHilbertTransformer
        this.detector = this.Detector()
    }

    @test()
    protected static async constructorInstantiatesHilbertTransform() {
        SpyHilbertTransformer.clear()
        new HilbertPeakDetector()
        assert.isEqual(SpyHilbertTransformer.constructorHitCount, 1)
    }

    @test()
    protected static async runCallsDependenciesAsExpected() {
        SpyHilbertTransformer.clear()
        SpyHilbertPeakDetector.clear()
        this.detector.run([1, 2, 3, 4], [1, 2, 3, 4])
        assert.isEqual(SpyHilbertTransformer.runHitCount, 2)
        assert.isEqual(SpyHilbertPeakDetector.generateSegmentsHitCount, 1)
        assert.isEqual(SpyHilbertPeakDetector.applyEnvelopeThresholdHitCount, 1)
        assert.isEqual(SpyHilbertPeakDetector.findPeaksHitCount, 1)
    }

    @test()
    protected static async runReturnsExpectedDataStructure() {
        const dummyData = [1, 2, 3, 4]
        const dummyTimestamps = [1, 2, 3, 4]

        const result = this.detector.run(dummyData, dummyTimestamps)

        const {
            filteredData,
            timestamps,
            upperAnalyticSignal,
            upperEnvelope,
            lowerAnalyticSignal,
            lowerEnvelope,
            thresholdedData,
            segmentedData,
            peaks,
        } = result

        assert.isEqualDeep(dummyData, filteredData)
        assert.isEqualDeep(dummyTimestamps, timestamps)
        assert.isAbove(upperAnalyticSignal.length, 0)
        assert.isAbove(upperEnvelope.length, 0)
        assert.isAbove(lowerAnalyticSignal.length, 0)
        assert.isAbove(lowerEnvelope.length, 0)
        assert.isAbove(thresholdedData.length, 0)
        assert.isAbove(segmentedData.length, 0)
        assert.isAbove(peaks.length, 0)
    }

    @test()
    protected static async runPadsDataWithZerosToNearestPowerOfTwo() {
        const examples = [1, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15]
        examples.forEach((length) => this.runForLength(length))
    }

    private static runForLength(length: number) {
        const { data, timestamps } = this.generateDummyData(length)
        return this.detector.run(data, timestamps)
    }

    private static generateDummyData(length: number) {
        const data = []
        const timestamps = []

        for (let i = 0; i < length; i++) {
            data.push(i)
            timestamps.push(i)
        }

        return { data, timestamps }
    }

    private static Detector() {
        SpyHilbertTransformer.clear()
        SpyHilbertPeakDetector.clear()
        return new SpyHilbertPeakDetector()
    }
}
