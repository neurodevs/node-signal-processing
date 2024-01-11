import { assertOptions } from '@sprucelabs/schema'
import { DataPoint } from './HilbertPeakDetector'
import PpgPeakDetector, { PpgPeakDetectorClass } from './PpgPeakDetector'

export default class PpgAnalyzer {
	protected sampleRate: number
	protected detector: PpgPeakDetector
	private static DetectorClass: PpgPeakDetectorClass = PpgPeakDetector

	public static setDetectorClass(Class: PpgPeakDetectorClass): void {
		PpgAnalyzer.DetectorClass = Class
	}

	public static getDetectorClass(): PpgPeakDetectorClass {
		return PpgAnalyzer.DetectorClass
	}

	public constructor(options: PpgAnalyzerOptions) {
		const { sampleRate } = assertOptions(options, ['sampleRate'])
		this.sampleRate = sampleRate

		this.detector = new PpgAnalyzer.DetectorClass({ sampleRate })
	}

	public run(data: number[], timestamps: number[]) {
		const result = this.detector.run(data, timestamps)
		const { peaks } = result

		const rrIntervals = this.calculateRrIntervals(peaks)
		const hrv = this.calculateRMSSD(rrIntervals)
		const hr = this.calculateHeartRate(rrIntervals)

		return {
			signals: result,
			metrics: {
				rrIntervals,
				hrv,
				hr,
			},
		}
	}

	private calculateRrIntervals(peaks: DataPoint[]) {
		const result = new Array(peaks.length - 1)

		peaks.forEach((peak, index) => {
			if (index === 0) {
				return
			}

			const previousPeak = peaks[index - 1]
			result[index - 1] = 1000 * (peak.timestamp - previousPeak.timestamp)
		})

		return result
	}

	private calculateRMSSD(rrIntervals: number[]): number {
		let squaredDifferences: number[] = rrIntervals
			.slice(1)
			.map((current, i) => Math.pow(current - rrIntervals[i], 2))

		let meanSquaredDifference =
			squaredDifferences.reduce((acc, curr) => acc + curr, 0) /
			squaredDifferences.length

		return Math.sqrt(meanSquaredDifference)
	}

	private calculateHeartRate(rrIntervals: number[]): number {
		let totalRR = rrIntervals.reduce((acc, curr) => acc + curr, 0)
		let avgRR = totalRR / rrIntervals.length

		const secondsPerMinute = 60
		const msPerSecond = 1000

		return (secondsPerMinute * msPerSecond) / avgRR
	}
}

export type PpgAnalyzerClass = new (options: PpgAnalyzerOptions) => PpgAnalyzer

export interface PpgAnalyzerOptions {
	sampleRate: number
}
