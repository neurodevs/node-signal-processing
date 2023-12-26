import HilbertTransform, { HilbertClass } from './HilbertTransform'

export default class HilbertPeakDetector {
	protected hilbert: HilbertTransform
	private static hilbertClass: HilbertClass = HilbertTransform

	public static setHilbertClass(hilbertClass: HilbertClass): void {
		HilbertPeakDetector.hilbertClass = hilbertClass
	}

	public static getHilbertClass(): HilbertClass {
		return HilbertPeakDetector.hilbertClass
	}

	public constructor() {
		this.hilbert = new HilbertPeakDetector.hilbertClass()
	}

	public run(data: number[], timestamps: number[]) {
		const upperAnalyticSignal = this.hilbert.run(data)
		this.hilbert.getEnvelope(upperAnalyticSignal)

		const lowerAnalyticSignal = this.hilbert.run(upperAnalyticSignal)
		const lowerEnvelope = this.hilbert.getEnvelope(lowerAnalyticSignal)

		const thresholdedData = this.applyEnvelopeThreshold(data, lowerEnvelope)
		const segmentedData = this.generateSegments(thresholdedData, timestamps)
		const peaks = this.findPeaks(segmentedData)

		return peaks
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

export type SegmentData = Segment[]
export type Segment = DataPoint[]

export type DataPoint = {
	value: number
	timestamp: number
}
