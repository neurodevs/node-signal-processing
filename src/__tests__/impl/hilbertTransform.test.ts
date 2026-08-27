import { test, assert } from '@neurodevs/node-tdd'

import { createFft } from '../../impl/createFft.js'
import {
    hilbertTransform,
    HilbertTransformResults,
} from '../../impl/hilbertTransform.js'
import {
    createSpyFftFactory,
    SpyFftFactory,
} from '../../testDoubles/createFft/createSpyFftFactory.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class HilbertTransformTest extends AbstractPackageTest {
    private static testData = [1, 2, 3, 4]
    private static spyFftFactory: SpyFftFactory
    private static result: HilbertTransformResults

    protected static async beforeEach() {
        await super.beforeEach()

        this.spyFftFactory = createSpyFftFactory()

        this.result = this.run(this.testData)
    }

    @test()
    protected static async throwsOnRunWithEmptyArray() {
        assert.doesThrow(() => this.run([]), 'Array cannot be empty!')
    }

    @test()
    protected static async throwsOnRunWithArrayOfLengthNotPowerOfTwo() {
        assert.doesThrow(
            () => this.run([1, 2, 3]),
            'Data for Hilbert transform must have length equal to a power of two!'
        )
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
    protected static async doesNotMutatePassedSignal() {
        const signal = [1, 2, 3, 4]
        this.run(signal)

        assert.isEqualDeep(signal, this.testData)
    }

    @test()
    protected static async runCallsFftExpectedNumberOfTimes() {
        assert.isEqual(this.spyFftFactory.calledWith.length, 1)
        assert.isEqual(this.spyFftFactory.forwardCalledWith.length, 1)
        assert.isEqual(this.spyFftFactory.inverseCalledWith.length, 1)
    }

    @test()
    protected static async runCallsFftWithExpectedRadix() {
        assert.isEqualDeep(this.spyFftFactory.calledWith[0], {
            radix: this.testData.length,
        })
    }

    @test()
    protected static async runCallsFftForwardWithExpectedData() {
        assert.isEqualDeep(
            this.spyFftFactory.forwardCalledWith[0],
            this.testData
        )
    }

    @test()
    protected static async acceptsInjectedFftFactory() {
        const callsToCreateFft: number[] = []

        this.run(this.testData, {
            createFft: (options) => {
                callsToCreateFft.push(options.radix)
                return createFft(options)
            },
        })

        assert.isEqualDeep(callsToCreateFft, [this.testData.length])
    }

    private static get analyticSignal() {
        return this.result.analyticSignal
    }

    private static get envelope() {
        return this.result.envelope
    }

    private static run(
        signal: readonly number[],
        options: Parameters<typeof hilbertTransform>[1] = {
            createFft: this.spyFftFactory,
        }
    ) {
        return hilbertTransform(signal, options)
    }
}
