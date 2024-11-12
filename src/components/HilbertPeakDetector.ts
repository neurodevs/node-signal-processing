import { isPowerOfTwo } from '../utils/validations'
import HilbertTransformer, {
    HilbertTransform,
    HilbertTransformResults,
} from './HilbertTransformer'

export default class HilbertPeakDetector implements PeakDetector {
    public static Class?: HilbertPeakDetectorConstructor

    private transformer: HilbertTransform
    private passedSignal!: number[]
    private signal!: number[]
    private timestamps!: number[]
    private upperHilbert!: HilbertTransformResults
    private lowerHilbert!: HilbertTransformResults
    private thresholdedSignal!: number[]
    private nonZeroSegments!: SignalSegment[]
    private peaks!: DataPoint[]

    protected constructor(transformer: HilbertTransform) {
        this.transformer = transformer
    }

    public static Create() {
        const transformer = this.HilbertTransformer()
        return new (this.Class ?? this)(transformer)
    }

    public run(filteredSignal: number[], timestamps: number[]) {
        this.passedSignal = filteredSignal

        this.signal = this.passedSignal.slice()
        this.timestamps = timestamps

        this.padSignalIfNotPowerOfTwo()
        this.calculateUpperEnvelope()
        this.calculateLowerEnvelope()
        this.thresholdSignalByLowerEnvelope()
        this.extractNonZeroSegments()
        this.detectPeaks()

        return this.results
    }

    private padSignalIfNotPowerOfTwo() {
        if (!this.signalLengthIsPowerOfTwo) {
            this.padSignalToNextPowerOfTwo()
        }
    }

    private padSignalToNextPowerOfTwo() {
        this.signal = [
            ...this.paddedZerosAtStart,
            ...this.signal,
            ...this.paddedZerosAtEnd,
        ]
    }

    private calculateUpperEnvelope() {
        this.upperHilbert = this.transformer.run(this.signal)
    }

    private calculateLowerEnvelope() {
        this.lowerHilbert = this.transformer.run(this.upperAnalyticSignal)
    }

    protected thresholdSignalByLowerEnvelope() {
        this.thresholdedSignal = this.signal.slice()

        for (let i = 0; i < this.signalLength; i++) {
            if (this.lowerEnvelope[i] > this.signal[i]) {
                this.thresholdedSignal[i] = 0
            }
        }
    }

    protected extractNonZeroSegments() {
        this.nonZeroSegments = []

        let currentSegment = this.createEmptySegment()

        for (let i = 0; i < this.signalLength; i++) {
            const value = this.thresholdedSignal[i]
            const timestamp = this.timestamps[i]

            if (value !== 0) {
                currentSegment.values.push(value)
                currentSegment.timestamps.push(timestamp)
            } else {
                if (currentSegment.values.length > 0) {
                    this.nonZeroSegments.push(currentSegment)
                    currentSegment = this.createEmptySegment()
                }
            }
        }

        if (currentSegment.values.length > 0) {
            this.nonZeroSegments.push(currentSegment)
        }
    }

    private createEmptySegment() {
        return {
            values: [],
            timestamps: [],
        } as SignalSegment
    }

    protected detectPeaks() {
        this.peaks = []

        for (const segment of this.nonZeroSegments) {
            const { values, timestamps } = segment

            const maxValue = Math.max(...values)
            const indexAtMaxValue = values.findIndex((v) => v == maxValue)
            const timestampAtMaxValue = timestamps[indexAtMaxValue]

            this.peaks.push({
                timestamp: timestampAtMaxValue,
                value: maxValue,
            })
        }
    }

    private get signalLength() {
        return this.passedSignal.length
    }

    private get signalLengthIsPowerOfTwo() {
        return isPowerOfTwo(this.signalLength)
    }

    private get nextPowerOfTwo() {
        const level = Math.log2(this.signalLength)
        return Math.pow(2, Math.ceil(level))
    }

    private get totalZerosToPad() {
        return this.nextPowerOfTwo - this.signalLength
    }

    private get numZerosToPadAtStart() {
        return Math.floor(this.totalZerosToPad / 2)
    }

    private get numZerosToPadAtEnd() {
        return this.totalZerosToPad - this.numZerosToPadAtStart
    }

    private get paddedZerosAtStart() {
        return Array(this.numZerosToPadAtStart).fill(0)
    }

    private get paddedZerosAtEnd() {
        return Array(this.numZerosToPadAtEnd).fill(0)
    }

    private get upperAnalyticSignal() {
        return this.upperHilbert.analyticSignal
    }

    private get upperEnvelope() {
        return this.upperHilbert.envelope
    }

    private get lowerAnalyticSignal() {
        return this.lowerHilbert.analyticSignal
    }

    private get lowerEnvelope() {
        return this.lowerHilbert.envelope
    }

    private get results() {
        return {
            filteredSignal: this.passedSignal,
            timestamps: this.timestamps,
            upperAnalyticSignal: this.upperAnalyticSignal,
            upperEnvelope: this.upperEnvelope,
            lowerAnalyticSignal: this.lowerAnalyticSignal,
            lowerEnvelope: this.lowerEnvelope,
            thresholdedSignal: this.thresholdedSignal,
            nonZeroSegments: this.nonZeroSegments,
            peaks: this.peaks,
        } as unknown as PeakDetectorResults
    }

    private static HilbertTransformer() {
        return HilbertTransformer.Create()
    }
}

export interface PeakDetector {
    run(filteredSignal: number[], timestamps: number[]): PeakDetectorResults
}

export type HilbertPeakDetectorConstructor = new (
    transformer: HilbertTransform
) => PeakDetector

export interface PeakDetectorResults {
    filteredSignal: number[]
    timestamps: number[]
    upperAnalyticSignal: number[]
    upperEnvelope: number[]
    lowerAnalyticSignal: number[]
    lowerEnvelope: number[]
    thresholdedSignal: number[]
    nonZeroSegments: SignalSegment[]
    peaks: DataPoint[]
}

export interface SignalSegment {
    values: number[]
    timestamps: number[]
}

export interface DataPoint {
    value: number
    timestamp: number
}
