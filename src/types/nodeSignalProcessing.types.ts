import FirBandpassFilter from '../FirBandpassFilter'
import HilbertPeakDetector from '../HilbertPeakDetector'
import HilbertTransform from '../HilbertTransform'

export interface FastFourierTransform {
	forward(data: number[]): ComplexNumbers
	inverse(data: ComplexNumbers): ComplexNumbers
}

export type FastFourierTransformClass = new (
	options: FftOptions
) => FastFourierTransform

export interface FftOptions {
	radix: number
}

export interface ComplexNumbers {
	real: number[]
	imaginary: number[]
}

export type FirBandpassFilterClass = new (
	options: FirBandpassFilterOptions
) => FirBandpassFilter

export interface FirBandpassFilterOptions {
	sampleRate: number
	lowCutoffHz: number
	highCutoffHz: number
	numTaps: number
	attenuation: number
}

export interface FirBandpassFilterRunOptions {
	usePadding?: boolean
	useNormalization?: boolean
}

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

export interface DataPoint {
	value: number
	timestamp: number
}

export type SegmentData = Segment[]
export type Segment = DataPoint[]

export type HilbertTransformClass = new () => HilbertTransform
