import HilbertTransform from './HilbertTransform'
import {
	PeakDetectorResults,
	SegmentData,
	DataPoint,
	HilbertTransformClass,
} from './types/nodeSignalProcessing.types'
import { isPowerOfTwo } from './validations'

export default class HilbertPeakDetector {
	public static HilbertClass: HilbertTransformClass = HilbertTransform

	protected hilbert: HilbertTransform

	public constructor() {
		this.hilbert = new HilbertPeakDetector.HilbertClass()
	}

	public run(filteredData: number[], timestamps: number[]) {
		let paddedData

		if (!isPowerOfTwo(filteredData.length)) {
			paddedData = this.padToNearestPowerOfTwo(filteredData)
		} else {
			paddedData = filteredData
		}

		const upperAnalyticSignal = this.hilbert.run(paddedData)
		const upperEnvelope = this.hilbert.getEnvelope(upperAnalyticSignal)

		const lowerAnalyticSignal = this.hilbert.run(upperAnalyticSignal)
		const lowerEnvelope = this.hilbert.getEnvelope(lowerAnalyticSignal)

		const thresholdedData = this.applyEnvelopeThreshold(
			filteredData,
			lowerEnvelope
		)
		const segmentedData = this.generateSegments(thresholdedData, timestamps)
		const peaks = this.findPeaks(segmentedData)

		return {
			filteredData,
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

	private padToNearestPowerOfTwo(arr: number[]) {
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

	protected applyEnvelopeThreshold(data: number[], lowerEnvelope: number[]) {
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

	protected findPeaks(segmentedData: SegmentData) {
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
