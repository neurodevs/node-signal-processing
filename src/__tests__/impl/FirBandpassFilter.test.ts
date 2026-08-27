import { test, assert } from '@neurodevs/node-tdd'

import {
    firBandpassFilter,
    FirBandpassFilterOptions,
} from '../../impl/firBandpassFilter.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class FirBandpassFilterTest extends AbstractPackageTest {
    private static testData = [1, 2, 3, 4]
    private static result: number[]

    protected static async beforeEach() {
        await super.beforeEach()

        this.result = this.firBandpassFilter(this.testData)
    }

    @test()
    protected static async throwsWithInvalidSampleRate() {
        const invalidValues = [0, -1, -1.5]
        invalidValues.forEach((value) => this.assertInvalidSampleRate(value))
    }

    @test()
    protected static async throwsWithInvalidLowCutoffHz() {
        const invalidValues = [0, -1, -1.5]
        invalidValues.forEach((value) => this.assertInvalidLowCutoffHz(value))
    }

    @test()
    protected static async throwsWithInvalidighCutoffHz() {
        const invalidValues = [0, -1, -1.5]
        invalidValues.forEach((value) => this.assertInvalidHighCutoffHz(value))
    }

    @test()
    protected static async throwsWithLowFreqGreaterOrEqualToHighFreq() {
        this.assertInvalidFrequencies(10, 5)
        this.assertInvalidFrequencies(10, 10)
    }

    @test()
    protected static async throwsWithInvalidNumTaps() {
        const invalidValues = [0, -1, -1.5, 1.5, 2, 4, 6, 8]
        invalidValues.forEach((value) => this.assertInvalidNumTaps(value))
    }

    @test()
    protected static async throwsWithInvalidAttenuation() {
        const invalidValues = [0, -1, -1.5]
        invalidValues.forEach((value) => this.assertInvalidAttenuation(value))
    }

    @test()
    protected static throwsWhenRunReceivesEmptyList() {
        assert.doesThrow(
            () => this.firBandpassFilter([]),
            'Array cannot be empty!'
        )
    }

    @test()
    protected static async resultHasExpectedValues() {
        assert.isEqualDeep(
            this.result,
            [
                -10.261761080429311, 119.97967410440859, 251.73264498046936,
                385.3659183863369,
            ]
        )
    }

    @test()
    protected static async runningTwiceReturnsSameResult() {
        const result1 = this.firBandpassFilter(this.testData)
        const result2 = this.firBandpassFilter(this.testData)
        assert.isEqualDeep(result1, result2)
    }

    @test()
    protected static async usesPaddingByDefault() {
        const resultWithPadding = this.firBandpassFilter(this.testData, {
            usePadding: true,
        })

        assert.isEqualDeep(this.result, resultWithPadding)
    }

    @test()
    protected static async resultWithoutPaddingHasExpectedValues() {
        const resultWithoutPadding = this.firBandpassFilter(this.testData, {
            usePadding: false,
        })

        assert.isEqualDeep(
            resultWithoutPadding,
            [
                0.0002427712885911702, 0.0009011649348037566,
                0.0010578137854440357, 0.0007969383931543167,
            ]
        )
    }

    @test()
    protected static async usesNormalizationByDefault() {
        const resultWithNormalization = this.firBandpassFilter(this.testData, {
            useNormalization: true,
        })

        assert.isEqualDeep(this.result, resultWithNormalization)
    }

    @test()
    protected static async resultWithoutNormalizationHasExpectedValues() {
        const resultWithoutNormalization = this.firBandpassFilter(
            this.testData,
            {
                useNormalization: false,
            }
        )

        assert.isEqualDeep(
            resultWithoutNormalization,
            [
                344.3188740646193, 731.651341398104, 1126.9102540262866,
                1531.201912464917,
            ]
        )
    }

    @test()
    protected static async normalizesSignalsTooLongForSpreadOperator() {
        const tooLong = 131072
        const signal = this.generateSignal(tooLong)

        // Passes if does not throw
        this.firBandpassFilter(signal)
    }

    private static generateSignal(length: number) {
        return Array.from({ length }, (_, i) => Math.sin(i))
    }

    private static assertInvalidSampleRate(sampleRate: number) {
        this.assertDoesThrowInvalidParameters(
            { sampleRate },
            'Sample rate must be a positive number!'
        )
    }

    private static assertInvalidLowCutoffHz(lowCutoffHz: number) {
        this.assertDoesThrowInvalidParameters(
            { lowCutoffHz },
            'Low frequency cutoff must be a positive number!'
        )
    }

    private static assertInvalidHighCutoffHz(highCutoffHz: number) {
        this.assertDoesThrowInvalidParameters(
            { highCutoffHz },
            'High frequency cutoff must be a positive number!'
        )
    }

    private static assertInvalidFrequencies(
        lowCutoffHz: number,
        highCutoffHz: number
    ) {
        this.assertDoesThrowInvalidParameters(
            { lowCutoffHz, highCutoffHz },
            'High frequency cutoff must be greater than low frequency cutoff!'
        )
    }

    private static assertInvalidNumTaps(numTaps: number) {
        this.assertDoesThrowInvalidParameters(
            { numTaps },
            'Number of taps must be an odd positive integer!'
        )
    }

    private static async assertInvalidAttenuation(attenuation: number) {
        this.assertDoesThrowInvalidParameters(
            { attenuation },
            'Attenuation must be a positive number!'
        )
    }

    private static assertDoesThrowInvalidParameters(
        options: Partial<FirBandpassFilterOptions>,
        message: string
    ) {
        assert.doesThrow(
            () => this.firBandpassFilter(this.testData, options),
            message
        )
    }

    private static generateOptions() {
        return {
            sampleRate: 1,
            lowCutoffHz: 0.1,
            highCutoffHz: 10,
            numTaps: 101,
            attenuation: 50,
        }
    }

    private static firBandpassFilter(
        signal: readonly number[],
        options: Partial<FirBandpassFilterOptions> = {}
    ) {
        return firBandpassFilter(signal, {
            ...this.generateOptions(),
            ...options,
        })
    }
}
