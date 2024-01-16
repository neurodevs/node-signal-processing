import { assertOptions } from '@sprucelabs/schema'
import { PeakDetectorResults } from './HilbertPeakDetector'

export default class PpgGrapher implements Grapher {
	public run(savePath: string, signals: PeakDetectorResults) {
		assertOptions({ savePath, signals }, ['savePath', 'signals'])
	}
}

export interface Grapher {
	run(savePath: string, signals: PeakDetectorResults): void
}
