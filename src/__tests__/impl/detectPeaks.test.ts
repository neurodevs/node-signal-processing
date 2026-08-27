import { test, assert } from '@neurodevs/node-tdd'

import { detectPeaks, DetectPeaksResults } from '../../impl/detectPeaks.js'
import { hilbertTransform } from '../../impl/hilbertTransform.js'
import {
    createSpyHilbertTransform,
    SpyHilbertTransform,
} from '../../testDoubles/hilbertTransform/createSpyHilbertTransform.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class DetectPeaksTest extends AbstractPackageTest {
    private static spyTransform: SpyHilbertTransform

    protected static async beforeEach() {
        await super.beforeEach()

        this.spyTransform = createSpyHilbertTransform()
    }

    @test()
    protected static async defaultsToRealHilbertTransform() {
        const signal = [1, 2, 3, 4]
        const timestamps = [1, 2, 3, 4]

        assert.isEqualDeep(
            detectPeaks(signal, timestamps),
            detectPeaks(signal, timestamps, { hilbertTransform })
        )
    }

    @test()
    protected static async callsDependenciesAsExpected() {
        this.run([1, 2, 3, 4], [1, 2, 3, 4])

        assert.isEqual(
            this.spyTransform.calledWith.length,
            2,
            'Incorrect number of calls to hilbertTransform!'
        )
    }

    @test()
    protected static async returnsExpectedDataStructure() {
        const dummyData = [1, 2, 3, 4]
        const dummyTimestamps = [1, 2, 3, 4]

        const result = this.run(dummyData, dummyTimestamps)

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
    protected static async padsDataWithZerosToNearestPowerOfTwo() {
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
        ] as (keyof DetectPeaksResults)[]

        const fieldLengths = fields.map((field) => results[field].length)
        const uniqueLengths = new Set(fieldLengths)

        assert.isEqual(
            uniqueLengths.size,
            1,
            `Not all signals have unique lengths: ${fieldLengths}!`
        )
    }

    @test()
    protected static async detectsPeaksInSegmentsTooLongForSpreadOperator() {
        const tooLong = 131072
        const signal = Array(tooLong).fill(1) as number[]
        const timestamps = signal.map((_, i) => i)

        // Passes if does not throw
        detectPeaks(signal, timestamps)
    }

    private static runForLength(length: number) {
        const { signal, timestamps } = this.generateDummyData(length)
        return this.run(signal, timestamps)
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

    private static run(
        filteredSignal: readonly number[],
        timestamps: readonly number[]
    ) {
        return detectPeaks(filteredSignal, timestamps, {
            hilbertTransform: this.spyTransform,
        })
    }
}
