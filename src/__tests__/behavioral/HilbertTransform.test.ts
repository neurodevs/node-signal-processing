import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import HilbertTransform from '../../HilbertTransform'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyFastFourierTransform from '../support/SpyFastFourierTransform'
import SpyHilbertPeakDetector from '../support/SpyHilbertPeakDetector'

export default class HilbertTransformTest extends AbstractSignalProcessingTest {
	private static hilbert: HilbertTransform
	private static testData = [1, 2, 3, 4]
	private static testResult: number[]
	private static testEnvelope: number[]

	protected static async beforeEach() {
		await super.beforeEach()
		HilbertTransform.setFftClass(SpyFastFourierTransform)
		SpyFastFourierTransform.clear()
		SpyHilbertPeakDetector.clear()
		this.hilbert = new HilbertTransform()
		this.testResult = this.hilbert.run(this.testData)
		this.testEnvelope = this.hilbert.getEnvelope(this.testResult)
	}

	@test()
	protected static async throwsOnRunWithEmptyArray() {
		const err = assert.doesThrow(() => this.hilbert.run([]))
		errorAssert.assertError(err, 'INVALID_EMPTY_ARRAY')
	}

	@test.skip('PPG data in segment might not be power of two, revisit this')
	protected static async throwsOnRunWithArrayOfLengthNotPowerOfTwo() {
		const err = assert.doesThrow(() => this.hilbert.run([1, 2, 3]))
		errorAssert.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['data'],
		})
	}

	@test()
	protected static canSetAndGetFftInstance() {
		HilbertTransform.setFftClass(SpyFastFourierTransform)
		assert.isEqual(HilbertTransform.getFftClass(), SpyFastFourierTransform)
	}

	@test()
	protected static async runReturnsAValidResponseAndHitsFftMethods() {
		assert.isEqual(this.testResult.length, this.testData.length)
		assert.isEqual(SpyFastFourierTransform.constructorHitCount, 1)
		assert.isEqual(SpyFastFourierTransform.forwardHitCount, 1)
		assert.isEqual(SpyFastFourierTransform.inverseHitCount, 1)
	}

	@test()
	protected static async getEnvelopeReturnsEnvelope() {
		assert.isTruthy(this.testEnvelope)
	}

	@test()
	protected static async getEnvelopeDoesNotModifyInputArray() {
		const resultCopy = this.testResult.slice()
		this.hilbert.getEnvelope(this.testResult)
		assert.isEqualDeep(this.testResult, resultCopy)
	}
}
