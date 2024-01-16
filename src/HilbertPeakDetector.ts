import HilbertTransform, { HilbertTransformClass } from './HilbertTransform'
import { isPowerOfTwo } from './validations'

export default class HilbertPeakDetector {
	protected hilbert: HilbertTransform
	private static HilbertClass: HilbertTransformClass = HilbertTransform

	public static setHilbertClass(Class: HilbertTransformClass): void {
		HilbertPeakDetector.HilbertClass = Class
	}

	public static getHilbertClass(): HilbertTransformClass {
		return HilbertPeakDetector.HilbertClass
	}

	public constructor() {
		this.hilbert = new HilbertPeakDetector.HilbertClass()
	}

	public run(data: number[], timestamps: number[]) {
		let formattedData

		if (!isPowerOfTwo(data.length)) {
			formattedData = this.padToNearestPowerOfTwo(data)
		} else {
			formattedData = data
		}

		const upperAnalyticSignal = this.hilbert.run(formattedData)
		const upperEnvelope = this.hilbert.getEnvelope(upperAnalyticSignal)

		const lowerAnalyticSignal = this.hilbert.run(upperAnalyticSignal)
		const lowerEnvelope = this.hilbert.getEnvelope(lowerAnalyticSignal)

		const thresholdedData = this.applyEnvelopeThreshold(data, lowerEnvelope)
		const segmentedData = this.generateSegments(thresholdedData, timestamps)
		const peaks = this.findPeaks(segmentedData)

		return {
			data,
			timestamps,
			upperAnalyticSignal,
			upperEnvelope,
			lowerAnalyticSignal,
			lowerEnvelope,
			thresholdedData,
			segmentedData,
			peaks,
		} as PeakDetectorResults
	}

	private padToNearestPowerOfTwo(arr: number[]): any {
		const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(arr.length)))

		const totalZerosToAdd = nextPowerOfTwo - arr.length

		// Split zeros roughly equally for the beginning and end
		const zerosAtStart = Math.floor(totalZerosToAdd / 2)
		const zerosAtEnd = totalZerosToAdd - zerosAtStart

		const newArray = [
			...Array(zerosAtStart).fill(0),
			...arr,
			...Array(zerosAtEnd).fill(0),
		]

		return newArray
	}

	protected applyEnvelopeThreshold(
		data: number[],
		lowerEnvelope: number[]
	): number[] {
		let result = data.slice()

		for (let i = 0; i < data.length; i++) {
			if (lowerEnvelope[i] > data[i]) {
				result[i] = 0
			}
		}

		return result
	}

	protected generateSegments(thresholdedData: number[], timestamps: number[]) {
		let segmentedData: SegmentData = []
		let currentSegment: DataPoint[] = []

		for (let i = 0; i < thresholdedData.length; i++) {
			let value = thresholdedData[i]
			if (value !== 0) {
				const timestamp = timestamps[i]
				currentSegment.push({ value, timestamp })
			} else {
				if (currentSegment.length > 0) {
					segmentedData.push(currentSegment)
					currentSegment = []
				}
			}
		}

		if (currentSegment.length > 0) {
			segmentedData.push(currentSegment)
		}

		return segmentedData
	}

	protected findPeaks(segmentedData: SegmentData): DataPoint[] {
		let peaks: DataPoint[] = []

		for (let segment of segmentedData) {
			const values = segment.map((item) => item.value)
			const timestamps = segment.map((item) => item.timestamp)
			const maxValue = Math.max(...values)
			const maxIndex = values.findIndex((element) => element === maxValue)
			peaks.push({ timestamp: timestamps[maxIndex], value: maxValue })
		}

		return peaks
	}
}

export type HilbertPeakDetectorClass = new () => HilbertPeakDetector

export interface PeakDetectorResults {
	data: number[]
	timestamps: number[]
	upperAnalyticSignal: number[]
	upperEnvelope: number[]
	lowerAnalyticSignal: number[]
	lowerEnvelope: number[]
	thresholdedData: number[]
	segmentedData: SegmentData
	peaks: DataPoint[]
}

export interface DataPoint {
	value: number
	timestamp: number
}

export type SegmentData = Segment[]
export type Segment = DataPoint[]
