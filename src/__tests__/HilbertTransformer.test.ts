import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import HilbertTransform from '../HilbertTransformer'
import SpyFft from '../testDoubles/SpyFft'
import { HilbertTransformResults } from '../types/nodeSignalProcessing.types'
import AbstractSignalProcessingTest from './AbstractSignalProcessingTest'

export default class HilbertTransformerTest extends AbstractSignalProcessingTest {
    private static testData = [1, 2, 3, 4]
    private static hilbert: HilbertTransform
    private static result: HilbertTransformResults

    protected static async beforeEach() {
        await super.beforeEach()

        HilbertTransform.FftClass = SpyFft
        SpyFft.clear()

        this.hilbert = new HilbertTransform()
        this.result = this.hilbert.run(this.testData)
    }

    @test()
    protected static async throwsOnRunWithEmptyArray() {
        const err = assert.doesThrow(() => this.hilbert.run([]))
        errorAssert.assertError(err, 'INVALID_EMPTY_ARRAY')
    }

    @test()
    protected static async throwsOnRunWithArrayOfLengthNotPowerOfTwo() {
        const err = assert.doesThrow(() => this.hilbert.run([1, 2, 3]))
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['data'],
        })
    }

    @test()
    protected static async analyticSignalAndEnvelopeHaveSameLengthAsInputData() {
        assert.isEqual(this.analyticSignal.length, this.testData.length)
        assert.isEqual(this.envelope.length, this.testData.length)
    }

    @test()
    protected static async analyticSignalAndEnvelopeHaveExpectedValues() {
        assert.isEqualDeep(
            this.analyticSignal,
            [-1, 0.9999999999999999, 1, -0.9999999999999999]
        )
        assert.isEqualDeep(
            this.envelope,
            [1, 0.9999999999999999, 1, 0.9999999999999999]
        )
    }

    @test()
    protected static async analyticSignalAndEnvelopeAreNotEqual() {
        assert.isNotEqualDeep(this.analyticSignal, this.envelope)
    }

    @test()
    protected static async runCallsFftExpectedNumberOfTimes() {
        assert.isEqual(SpyFft.constructorHitCount, 1)
        assert.isEqual(SpyFft.forwardHitCount, 1)
        assert.isEqual(SpyFft.inverseHitCount, 1)
    }

    @test()
    protected static async runCallsFftWithExpectedRadix() {
        assert.isEqualDeep(SpyFft.constructorCalledWith[0], {
            radix: this.testData.length,
        })
    }

    @test()
    protected static async runCallsFftForwardWithExpectedData() {
        assert.isEqualDeep(SpyFft.forwardCalledWith[0], this.testData)
    }

    private static get analyticSignal() {
        return this.result.analyticSignal
    }

    private static get envelope() {
        return this.result.envelope
    }
}
