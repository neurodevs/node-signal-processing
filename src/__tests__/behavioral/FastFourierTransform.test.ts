import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import Fft from '../../FastFourierTransform'
import { FftOptions } from '../../types/nodeSignalProcessing.types'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyFft from '../../testDoubles/SpyFft'

export default class FastFourierTransformTest extends AbstractSignalProcessingTest {
	private static fft: SpyFft
	private static fftOptions: FftOptions
	private static testData = [1, 2, 3, 4]

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
	protected static async throwsIfForwardDataLengthNotEqualToRadix() {
		const radix = 1024
		const fft = this.Fft({ radix })
		const err = assert.doesThrow(() => fft.forward([1, 2, 3, 4]))
		errorAssert.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['radix', 'data'],
		})
	}

	@test()
	protected static async throwsIfInverseDataLengthNotEqualToRadix() {
		const radix = 4
		const fft = this.Fft({ radix })
		const err = assert.doesThrow(() =>
			fft.inverse({
				real: [1, 2],
				imaginary: [1, 2],
			})
		)
		errorAssert.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['radix', 'data'],
		})
	}

	@test()
	protected static async constructorSavesOptions() {
		assert.isNumber(this.fft.getRadix())
	}

	@test()
	protected static async loadFftReturnsConfiguredFft() {
		const fft = this.fft.load()
		assert.isTruthy(fft)
	}

	@test()
	protected static async forwardReturnsTransformedData() {
		const result = this.fft.forward(this.testData)
		assert.isNotEqualDeep(result as any, this.testData)
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
		assert.isNotEqualDeep(inverseResult.real, inverseResult.imaginary)
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
