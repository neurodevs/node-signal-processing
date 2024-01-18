import { assertOptions } from '@sprucelabs/schema'
import { DataPoint, PeakDetectorResults } from './HilbertPeakDetector'
import PpgPeakDetector, { PpgPeakDetectorClass } from './PpgPeakDetector'

export default class PpgAnalyzerImpl implements PpgAnalyzer {
	protected sampleRate: number
	protected ignoreRrIntervalThreshold: number
	protected detector: PpgPeakDetector
	private static DetectorClass: PpgPeakDetectorClass = PpgPeakDetector

	public static setDetectorClass(Class: PpgPeakDetectorClass): void {
		PpgAnalyzerImpl.DetectorClass = Class
	}

	public static getDetectorClass(): PpgPeakDetectorClass {
		return PpgAnalyzerImpl.DetectorClass
	}

	public constructor(options: PpgAnalyzerOptions) {
		const { sampleRate, ignoreRrIntervalThreshold = 25 } = assertOptions(
			options,
			['sampleRate']
		)
		this.sampleRate = sampleRate

		this.detector = new PpgAnalyzerImpl.DetectorClass({ sampleRate })
		this.ignoreRrIntervalThreshold = ignoreRrIntervalThreshold
	}

	public run(data: number[], timestamps: number[]): PpgAnalyzerResults {
		const middleIdx = Math.floor(data.length / 2)

		const dataFirstHalf = data.slice(0, middleIdx)
		const timestampsFirstHalf = timestamps.slice(0, middleIdx)

		const dataSecondHalf = data.slice(middleIdx)
		const timestampsSecondHalf = timestamps.slice(middleIdx)

		const { result, rrIntervals, hrvMean, hrMean } = this.calculateMetrics(
			data,
			timestamps
		)

		const { hrvMean: hrvMeanFirstHalf, hrMean: hrMeanFirstHalf } =
			this.calculateMetrics(dataFirstHalf, timestampsFirstHalf)

		const { hrvMean: hrvMeanSecondHalf, hrMean: hrMeanSecondHalf } =
			this.calculateMetrics(dataSecondHalf, timestampsSecondHalf)

		const hrvPercentChange = this.calculatePercentChange(
			hrvMeanFirstHalf,
			hrvMeanSecondHalf
		)

		const hrPercentChange = this.calculatePercentChange(
			hrMeanFirstHalf,
			hrMeanSecondHalf
		)

		return {
			signals: result,
			metrics: {
				rrIntervals,
				hrvMean,
				hrMean,
				hrvPercentChange,
				hrPercentChange,
			},
		}
	}
	private calculatePercentChange(
		meanFirstHalf: number,
		meanSecondHalf: number
	) {
		return ((meanSecondHalf - meanFirstHalf) / meanFirstHalf) * 100
	}

	private calculateMetrics(data: number[], timestamps: number[]) {
		const result = this.detector.run(data, timestamps)
		const { peaks } = result

		const rrIntervals = this.calculateRrIntervals(peaks)
		const hrvMean = this.calculateHeartRateVariability(rrIntervals)
		const hrMean = this.calculateHeartRate(rrIntervals)
		return { result, rrIntervals, hrvMean, hrMean }
	}

	private calculateRrIntervals(peaks: DataPoint[]): number[] {
		const result = new Array(peaks.length - 1)

		peaks.forEach((peak, index) => {
			if (index === 0) {
				return
			}

			const previousPeak = peaks[index - 1]
			result[index - 1] = peak.timestamp - previousPeak.timestamp
		})

		return result
	}

	protected calculateHeartRateVariability(rrIntervals: number[]) {
		const squaredDifferences: number[] = []

		for (let i = 1; i < rrIntervals.length; i++) {
			const current = rrIntervals[i]
			const previous = rrIntervals[i - 1]

			const diff = this.calculateAbsDifference(previous, current)

			if (diff < this.ignoreRrIntervalThreshold) {
				const squaredDifference = Math.pow(current - previous, 2)
				squaredDifferences.push(squaredDifference)
			}
		}

		let meanSquaredDifference =
			squaredDifferences.reduce((acc, curr) => acc + curr, 0) /
			squaredDifferences.length

		return Math.sqrt(meanSquaredDifference)
	}

	private calculateAbsDifference(a: number, b: number) {
		return (100 * Math.abs(a - b)) / a
	}

	private calculateHeartRate(rrIntervals: number[]) {
		let totalRR = rrIntervals.reduce((acc, curr) => acc + curr, 0)
		let avgRR = totalRR / rrIntervals.length

		const secondsPerMinute = 60
		const msPerSecond = 1000

		return (secondsPerMinute * msPerSecond) / avgRR
	}
}

export interface PpgAnalyzer {
	run(data: number[], timestamps: number[]): PpgAnalyzerResults
}

export interface PpgAnalyzerOptions {
	sampleRate: number
	ignoreRrIntervalThreshold?: number
}

export type PpgAnalyzerClass = new (options: PpgAnalyzerOptions) => PpgAnalyzer

export interface PpgAnalyzerResults {
	signals: PeakDetectorResults
	metrics: PpgMetrics
}

export interface PpgMetrics {
	rrIntervals: number[]
	hrvMean: number
	hrvPercentChange: number
	hrMean: number
	hrPercentChange: number
}

export interface CalculateHrvOptions {
	ignoreRrIntervalThreshold: number
}
