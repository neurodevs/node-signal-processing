import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import { PeakDetectorResults } from '../../HilbertPeakDetector'
import PpgGrapher from '../../PpgGrapher'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'

export default class PpgGrapherTest extends AbstractSignalProcessingTest {
	private static grapher: PpgGrapher
	private static savePath: string
	private static signals: PeakDetectorResults

	protected static async beforeEach() {
		await super.beforeEach()
		this.grapher = new PpgGrapher()
		this.savePath = 'asdf'
		this.signals = {
			data: [],
			timestamps: [],
			upperAnalyticSignal: [],
			upperEnvelope: [],
			lowerAnalyticSignal: [],
			lowerEnvelope: [],
			thresholdedData: [],
			segmentedData: [],
			peaks: [],
		} as PeakDetectorResults
	}

	@test()
	protected static async runThrowsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => this.grapher.run())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['savePath', 'signals'],
		})
	}

	protected static async run() {
		this.grapher.run(this.savePath, this.signals)
	}
}
