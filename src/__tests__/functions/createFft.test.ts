import { test, assert } from '@neurodevs/node-tdd'

import {
    createFft,
    FastFourierTransform,
    FftOptions,
} from '../../functions/createFft.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class CreateFftTest extends AbstractPackageTest {
    private static testData = [1, 2, 3, 4]
    private static fft: FastFourierTransform

    protected static async beforeEach() {
        await super.beforeEach()

        this.fft = this.Fft()
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

        assert.doesThrow(
            () => fft.forward([1, 2, 3, 4]),
            'Data must be same length as radix!'
        )
    }

    @test()
    protected static async throwsIfInverseSignalLengthNotEqualToRadix() {
        const radix = 4
        const fft = this.Fft({ radix })

        assert.doesThrow(
            () =>
                fft.inverse({
                    real: [1, 2],
                    imaginary: [1, 2],
                }),
            'Data must be same length as radix!'
        )
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
        this.assertDoesThrowInvalidParameters(
            { radix },
            'Radix must be a power of two!'
        )
    }

    private static assertDoesThrowInvalidParameters(
        options: Partial<FftOptions>,
        message: string
    ) {
        assert.doesThrow(() => this.Fft(options), message)
    }

    private static generateOptions() {
        return {
            radix: 4,
        }
    }

    private static Fft(options?: Partial<FftOptions>) {
        return createFft({
            ...this.generateOptions(),
            ...options,
        })
    }
}
