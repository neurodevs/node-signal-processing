import AbstractSpruceTest from '@sprucelabs/test-utils'

export default abstract class AbstractSignalProcessingTest extends AbstractSpruceTest {
	protected static async beforeEach() {
		await super.beforeEach()
	}

	protected static formatLog(actual: any) {
		const formatted = JSON.stringify(actual, null, 2)
		this.log(formatted)
	}
}
