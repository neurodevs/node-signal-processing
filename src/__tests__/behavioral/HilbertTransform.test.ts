import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import { HilbertTransform } from '../../HilbertTransform'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import { SpyFft } from './Fft.test'

export default class HilbertTransformTest extends AbstractSignalProcessingTest {
	private static hilbert: HilbertTransform
	private static testData = [1, 2, 3, 4]

	protected static async beforeEach() {
		await super.beforeEach()
		HilbertTransform.setFftClass(SpyFft)
		SpyFft.clear()
		this.hilbert = new HilbertTransform()
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
		const result = this.hilbert.run(this.testData)
		assert.isEqual(result.length, this.testData.length)
		assert.isEqual(SpyFft.constructorHitCount, 1)
		assert.isEqual(SpyFft.forwardHitCount, 1)
		assert.isEqual(SpyFft.inverseHitCount, 1)
	}
}
