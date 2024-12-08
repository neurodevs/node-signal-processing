import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import Fft, { FftOptions } from '../components/Fft'
import SpyFft from '../testDoubles/Fft/SpyFft'
import AbstractSignalProcessingTest from './AbstractSignalProcessingTest'

export default class FastFourierTransformTest extends AbstractSignalProcessingTest {
    private static testData = [1, 2, 3, 4]
    private static fft: SpyFft
    private static fftOptions: FftOptions

    protected static async beforeEach() {
        await super.beforeEach()

        this.fftOptions = this.generateOptions()
        this.fft = this.Fft()
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        // @ts-ignore
        const err = assert.doesThrow(() => new Fft())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['radix'],
        })
    }

    @test()
    protected static async throwsIfRadixIsNotPowerOfTwo() {
        const invalidValues = [3, 5, 6, 7, 9, 1.5, -1, -1.5, 0]
        invalidValues.forEach((value) => this.assertInvalidRadix(value))
    }

    @test()
    protected static async throwsIfForwardSignalLengthNotEqualToRadix() {
        const radix = 1024
        const fft = this.Fft({ radix })
        const err = assert.doesThrow(() => fft.forward([1, 2, 3, 4]))
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['radix', 'signal'],
        })
    }

    @test()
    protected static async throwsIfInverseSignalLengthNotEqualToRadix() {
        const radix = 4
        const fft = this.Fft({ radix })
        const err = assert.doesThrow(() =>
            fft.inverse({
                real: [1, 2],
                imaginary: [1, 2],
            })
        )
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['radix', 'signal'],
        })
    }

    @test()
    protected static async forwardResultHasExpectedValues() {
        const result = this.fft.forward(this.testData)
        assert.isEqualDeep(result, {
            real: [10, -2, -2, -1.9999999999999998],
            imaginary: [0, 2, 0, -2],
        })
    }

    @test()
    protected static async runningForwardTwiceReturnsSameResult() {
        const result1 = this.fft.forward(this.testData)
        const result2 = this.fft.forward(this.testData)
        assert.isEqualDeep(result1, result2)
    }

    @test()
    protected static async forwardAndInverseReturnsOriginalData() {
        const forwardResult = this.fft.forward(this.testData)
        const inverseResult = this.fft.inverse(forwardResult)
        assert.isEqualDeep(inverseResult.real, this.testData)
    }

    private static assertInvalidRadix(radix: number) {
        this.assertDoesThrowInvalidParameters({ radix }, ['radix'])
    }

    private static assertDoesThrowInvalidParameters(
        options: Partial<FftOptions>,
        parameters: string[]
    ) {
        const err = assert.doesThrow(() => this.Fft(options))
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters,
        })
    }

    private static generateOptions(options?: Partial<FftOptions>) {
        const defaultOptions = {
            radix: 4,
        }
        return {
            ...defaultOptions,
            ...options,
        }
    }

    private static Fft(options?: Partial<FftOptions>) {
        return new SpyFft({
            ...this.fftOptions,
            ...options,
        })
    }
}
