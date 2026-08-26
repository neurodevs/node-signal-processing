import { test, assert } from '@neurodevs/node-tdd'

import HilbertPeakDetector, {
    PeakDetectorResults,
} from '../../impl/HilbertPeakDetector.js'
import { hilbertTransform } from '../../impl/hilbertTransform.js'
import SpyHilbertPeakDetector from '../../testDoubles/HilbertPeakDetector/SpyHilbertPeakDetector.js'
import {
    createSpyHilbertTransform,
    SpyHilbertTransform,
} from '../../testDoubles/hilbertTransform/createSpyHilbertTransform.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class HilbertPeakDetectorTest extends AbstractPackageTest {
    private static detector: HilbertPeakDetector
    private static spyTransform: SpyHilbertTransform

    protected static async beforeEach() {
        HilbertPeakDetector.Class = SpyHilbertPeakDetector

        this.detector = this.Detector()
    }

    @test()
    protected static async defaultsToRealHilbertTransform() {
        const signal = [1, 2, 3, 4]
        const timestamps = [1, 2, 3, 4]

        const withDefault = HilbertPeakDetector.Create()
        const withInjected = HilbertPeakDetector.Create({ hilbertTransform })

        assert.isEqualDeep(
            withDefault.run(signal, timestamps),
            withInjected.run(signal, timestamps)
        )
    }

    @test()
    protected static async runCallsDependenciesAsExpected() {
        SpyHilbertPeakDetector.resetTestDouble()

        this.detector.run([1, 2, 3, 4], [1, 2, 3, 4])

        assert.isEqual(
            this.spyTransform.calledWith.length,
            2,
            'Incorrect number of calls to hilbertTransform!'
        )

        assert.isEqual(
            SpyHilbertPeakDetector.generateSegmentsHitCount,
            1,
            'Incorrect number of calls to generateSegments!'
        )

        assert.isEqual(
            SpyHilbertPeakDetector.applyEnvelopeThresholdHitCount,
            1,
            'Incorrect number of calls to applyEnvelopeThreshold!'
        )

        assert.isEqual(
            SpyHilbertPeakDetector.findPeaksHitCount,
            1,
            'Incorrect number of calls to findPeaks!'
        )
    }

    @test()
    protected static async runReturnsExpectedDataStructure() {
        const dummyData = [1, 2, 3, 4]
        const dummyTimestamps = [1, 2, 3, 4]

        const result = this.detector.run(dummyData, dummyTimestamps)

        const {
            filteredSignal: signal,
            timestamps,
            upperAnalyticSignal,
            upperEnvelope,
            lowerAnalyticSignal,
            lowerEnvelope,
            thresholdedSignal,
            nonZeroSegments,
            peaks,
        } = result

        assert.isEqualDeep(dummyData, signal)
        assert.isEqualDeep(dummyTimestamps, timestamps)
        assert.isAbove(upperAnalyticSignal.length, 0)
        assert.isAbove(upperEnvelope.length, 0)
        assert.isAbove(lowerAnalyticSignal.length, 0)
        assert.isAbove(lowerEnvelope.length, 0)
        assert.isAbove(thresholdedSignal.length, 0)
        assert.isAbove(nonZeroSegments.length, 0)
        assert.isAbove(peaks.length, 0)
    }

    @test()
    protected static async runPadsDataWithZerosToNearestPowerOfTwo() {
        const examples = [1, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15]
        examples.forEach((length) => this.runForLength(length))
    }

    @test()
    protected static async allSignalsHaveSameLength() {
        const results = this.runForLength(20)

        const fields = [
            'filteredSignal',
            'upperAnalyticSignal',
            'lowerAnalyticSignal',
            'thresholdedSignal',
        ] as (keyof PeakDetectorResults)[]

        const fieldLengths = fields.map((field) => results[field].length)
        const uniqueLengths = new Set(fieldLengths)

        assert.isEqual(
            uniqueLengths.size,
            1,
            `Not all signals have unique lengths: ${fieldLengths}!`
        )
    }

    private static runForLength(length: number) {
        const { signal, timestamps } = this.generateDummyData(length)
        return this.detector.run(signal, timestamps)
    }

    private static generateDummyData(length: number) {
        const signal = []
        const timestamps = []

        for (let i = 0; i < length; i++) {
            signal.push(i)
            timestamps.push(i)
        }

        return { signal, timestamps }
    }

    private static Detector() {
        SpyHilbertPeakDetector.resetTestDouble()

        this.spyTransform = createSpyHilbertTransform()

        return HilbertPeakDetector.Create({
            hilbertTransform: this.spyTransform,
        }) as SpyHilbertPeakDetector
    }
}
