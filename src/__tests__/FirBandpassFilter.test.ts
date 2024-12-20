import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import FirBandpassFilter, {
    FirBandpassFilterOptions,
} from '../components/FirBandpassFilter'
import SpyFirBandpassFilter from '../testDoubles/FirBandpassFilter/SpyFirBandpassFilter'
import AbstractSignalProcessingTest from './AbstractSignalProcessingTest'

export default class FirBandpassFilterTest extends AbstractSignalProcessingTest {
    private static testData = [1, 2, 3, 4]
    private static filter: SpyFirBandpassFilter
    private static options: FirBandpassFilterOptions
    private static result: number[]

    protected static async beforeEach() {
        await super.beforeEach()

        this.options = this.generateOptions()
        this.filter = this.Filter(this.options)
        this.result = this.filter.run(this.testData)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        // @ts-ignore
        const err = assert.doesThrow(() => new FirBandpassFilter())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: [
                'sampleRate',
                'lowCutoffHz',
                'highCutoffHz',
                'numTaps',
                'attenuation',
            ],
        })
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
        const err = assert.doesThrow(() => this.filter.run([]))
        errorAssert.assertError(err, 'INVALID_EMPTY_ARRAY')
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
        const result1 = this.filter.run(this.testData)
        const result2 = this.filter.run(this.testData)
        assert.isEqualDeep(result1, result2)
    }

    @test()
    protected static async usesPaddingByDefault() {
        assert.isTrue(this.filter.getUsePadding())
    }

    @test()
    protected static async resultWithoutPaddingHasExpectedValues() {
        const filterWithoutPadding = this.Filter({ usePadding: false })
        const resultWithoutPadding = filterWithoutPadding.run(this.testData)
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
        assert.isTrue(this.filter.getUseNormalization())
    }

    @test()
    protected static async resultWithoutNormalizationHasExpectedValues() {
        const filterWithoutNormalization = this.Filter({
            useNormalization: false,
        })
        const resultWithoutNormalization = filterWithoutNormalization.run(
            this.testData
        )
        assert.isEqualDeep(
            resultWithoutNormalization,
            [
                344.3188740646193, 731.651341398104, 1126.9102540262866,
                1531.201912464917,
            ]
        )
    }

    private static assertInvalidSampleRate(sampleRate: number) {
        this.assertDoesThrowInvalidParameters({ sampleRate }, ['sampleRate'])
    }

    private static assertInvalidLowCutoffHz(lowCutoffHz: number) {
        this.assertDoesThrowInvalidParameters({ lowCutoffHz }, ['lowCutoffHz'])
    }

    private static assertInvalidHighCutoffHz(highCutoffHz: number) {
        this.assertDoesThrowInvalidParameters({ highCutoffHz }, [
            'highCutoffHz',
        ])
    }

    private static assertInvalidFrequencies(
        lowCutoffHz: number,
        highCutoffHz: number
    ) {
        this.assertDoesThrowInvalidParameters({ lowCutoffHz, highCutoffHz }, [
            'lowCutoffHz',
            'highCutoffHz',
        ])
    }

    private static assertInvalidNumTaps(numTaps: number) {
        this.assertDoesThrowInvalidParameters({ numTaps }, ['numTaps'])
    }

    private static async assertInvalidAttenuation(attenuation: number) {
        this.assertDoesThrowInvalidParameters({ attenuation }, ['attenuation'])
    }

    private static assertDoesThrowInvalidParameters(
        options: Partial<FirBandpassFilterOptions>,
        parameters: string[]
    ) {
        const err = assert.doesThrow(() => this.Filter(options))
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters,
        })
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

    private static Filter(options: Partial<FirBandpassFilterOptions>) {
        const defaultOptions = this.generateOptions()
        return new SpyFirBandpassFilter({
            ...defaultOptions,
            ...options,
        })
    }
}
