import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import HilbertTransform from '../../HilbertTransform'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyFft from '../support/SpyFft'
import SpyHilbertPeakDetector from '../support/SpyHilbertPeakDetector'

export default class HilbertTransformTest extends AbstractSignalProcessingTest {
	private static hilbert: HilbertTransform
	private static testData = [1, 2, 3, 4]
	private static testResult: number[]
	private static testEnvelope: number[]

	protected static async beforeEach() {
		await super.beforeEach()
		HilbertTransform.setFftClass(SpyFft)
		SpyFft.clear()
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

	@test()
	protected static async throwsOnRunWithArrayOfLengthNotPowerOfTwo() {
		const err = assert.doesThrow(() => this.hilbert.run([1, 2, 3]))
		errorAssert.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['data'],
		})
	}

	@test()
	protected static canSetAndGetFftInstance() {
		HilbertTransform.setFftClass(SpyFft)
		assert.isEqual(HilbertTransform.getFftClass(), SpyFft)
	}

	@test()
	protected static async runReturnsAValidResponseAndHitsFftMethods() {
		assert.isEqual(this.testResult.length, this.testData.length)
		assert.isEqual(SpyFft.constructorHitCount, 1)
		assert.isEqual(SpyFft.forwardHitCount, 1)
		assert.isEqual(SpyFft.inverseHitCount, 1)
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
