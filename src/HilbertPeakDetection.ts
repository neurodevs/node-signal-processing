import FirBandpassFilter, {
	FirBandpassFilterOptions,
} from './FirBandpassFilter'
import HilbertTransform from './HilbertTransform'

export default class HilbertPeakDetection {
	protected filter: FirBandpassFilter
	private static filterClass: FilterClass = FirBandpassFilter
	protected hilbert: HilbertTransform
	private static hilbertClass: HilbertClass = HilbertTransform

	public static setFilterClass(filterClass: FilterClass): void {
		HilbertPeakDetection.filterClass = filterClass
	}

	public static getFilterClass(): FilterClass {
		return HilbertPeakDetection.filterClass
	}

	public static setHilbertClass(hilbertClass: HilbertClass): void {
		HilbertPeakDetection.hilbertClass = hilbertClass
	}

	public static getHilbertClass(): HilbertClass {
		return HilbertPeakDetection.hilbertClass
	}

	public constructor() {
		this.filter = new HilbertPeakDetection.filterClass({
			sampleRate: 64,
			lowCutoffHz: 0.4,
			highCutoffHz: 4,
			numTaps: 101,
			attenuation: 50,
		})

		this.hilbert = new HilbertPeakDetection.hilbertClass()
	}

	public run(data: number[], timestamps: number[]) {
		const filteredData = this.filter.run(data)

		const upperAnalyticSignal = this.hilbert.run(filteredData)
		this.hilbert.getEnvelope(upperAnalyticSignal)

		const lowerAnalyticSignal = this.hilbert.run(upperAnalyticSignal)
		const lowerEnvelope = this.hilbert.getEnvelope(lowerAnalyticSignal)

		const thresholdedData = this.applyEnvelopeThreshold(
			filteredData,
			lowerEnvelope
		)
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

export type FilterClass = new (
	options: FirBandpassFilterOptions
) => FirBandpassFilter

export type HilbertClass = new () => HilbertTransform

export type SegmentData = Segment[]
export type Segment = DataPoint[]

export type DataPoint = {
	value: number
	timestamp: number
}
