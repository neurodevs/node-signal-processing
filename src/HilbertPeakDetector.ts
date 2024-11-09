import HilbertTransformer, { HilbertTransform } from './HilbertTransformer'
import { isPowerOfTwo } from './validations'

export default class HilbertPeakDetector implements PeakDetector {
    public static Class?: HilbertPeakDetectorConstructor

    private transformer: HilbertTransform

    protected constructor(transformer: HilbertTransform) {
        this.transformer = transformer
    }

    public static Create() {
        const transformer = this.HilbertTransformer()
        return new (this.Class ?? this)(transformer)
    }

    public run(filteredData: number[], timestamps: number[]) {
        let paddedData

        if (!isPowerOfTwo(filteredData.length)) {
            paddedData = this.padToNearestPowerOfTwo(filteredData)
        } else {
            paddedData = filteredData
        }

        const { analyticSignal: upperAnalyticSignal, envelope: upperEnvelope } =
            this.transformer.run(paddedData)

        const { analyticSignal: lowerAnalyticSignal, envelope: lowerEnvelope } =
            this.transformer.run(upperAnalyticSignal)

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
        }
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

    protected generateSegments(
        thresholdedData: number[],
        timestamps: number[]
    ) {
        debugger
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

    private static HilbertTransformer() {
        return HilbertTransformer.Create()
    }
}

export interface PeakDetector {
    run(filteredData: number[], timestamps: number[]): PeakDetectorResults
}

export type HilbertPeakDetectorConstructor = new (
    transformer: HilbertTransform
) => PeakDetector

export interface PeakDetectorResults {
    filteredData: number[]
    timestamps: number[]
    upperAnalyticSignal: number[]
    upperEnvelope: number[]
    lowerAnalyticSignal: number[]
    lowerEnvelope: number[]
    thresholdedData: number[]
    segmentedData: SegmentData
    peaks: DataPoint[]
}

export type SegmentData = Segment[]

export type Segment = DataPoint[]

export interface DataPoint {
    value: number
    timestamp: number
}
