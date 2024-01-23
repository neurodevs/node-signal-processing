import { test, assert } from '@sprucelabs/test-utils'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyComposite from '../support/SpyComposite'

export default class CompositeTest extends AbstractSignalProcessingTest {
	private static composite: SpyComposite

	protected static async beforeEach() {
		this.composite = this.Composite()
		assert.isTruthy(this.composite)
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {}

	private static Composite() {
		return new SpyComposite({})
	}
}
