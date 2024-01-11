import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import FastFourierTransform, {
	FastFourierTransformOptions,
} from '../../FastFourierTransform'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyFastFourierTransform from '../support/SpyFastFourierTransform'

export default class FastFourierTransformTest extends AbstractSignalProcessingTest {
	private static defaultOptions: FastFourierTransformOptions
	private static fft: SpyFastFourierTransform
	private static testData = [1, 2, 3, 4]

	protected static async beforeEach() {
		await super.beforeEach()
		this.defaultOptions = this.generateOptions()
		this.fft = this.Fft()
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => new FastFourierTransform())
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

	private static Fft(options?: Partial<FastFourierTransformOptions>) {
		return new SpyFastFourierTransform({
			...this.defaultOptions,
			...options,
		})
	}

	private static assertInvalidRadix(radix: number) {
		this.assertDoesThrowInvalidParameters({ radix }, ['radix'])
	}

	private static assertDoesThrowInvalidParameters(
		options: Partial<FastFourierTransformOptions>,
		parameters: string[]
	) {
		const err = assert.doesThrow(() => this.Fft(options))
		errorAssert.assertError(err, 'INVALID_PARAMETERS', {
			parameters,
		})
	}

	private static generateOptions(
		options?: Partial<FastFourierTransformOptions>
	) {
		const defaultOptions = {
			radix: 4,
		}
		return {
			...defaultOptions,
			...options,
		}
	}
}