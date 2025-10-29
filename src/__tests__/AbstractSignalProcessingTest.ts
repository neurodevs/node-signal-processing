import AbstractModuleTest from '@neurodevs/node-tdd'

export default abstract class AbstractSignalProcessingTest extends AbstractModuleTest {
    protected static async beforeEach() {
        await super.beforeEach()
    }

    protected static formatLog(actual: any) {
        const formatted = JSON.stringify(actual, null, 2)
        this.log(formatted)
    }
}
