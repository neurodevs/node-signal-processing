import HilbertPeakDetector from '../HilbertPeakDetector'

export interface FastFourierTransform {
	forward(data: number[]): ComplexNumbers
	inverse(data: ComplexNumbers): ComplexNumbers
}

export type FftClass = new (options: FftOptions) => FastFourierTransform

export interface FftOptions {
	radix: number
}

export interface Filter {
	run(data: number[]): number[]
}

export type FirBandpassFilterClass = new (
	options: FirBandpassFilterOptions
) => Filter

export interface FirBandpassFilterOptions {
	sampleRate: number
	lowCutoffHz: number
	highCutoffHz: number
	numTaps: number
	attenuation: number
	usePadding?: boolean
	useNormalization?: boolean
}

export interface HilbertTransform {
	run(data: number[]): HilbertTransformResults
}

export interface HilbertTransformResults {
	analyticSignal: number[]
	envelope: number[]
}

export type HilbertTransformerClass = new () => HilbertTransform

export type HilbertPeakDetectorClass = new () => HilbertPeakDetector

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

export interface ComplexNumbers {
	real: number[]
	imaginary: number[]
}
