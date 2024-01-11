import { plot } from 'nodeplotlib'
import { loadCsv } from './__tests__/support/loader'
import FirBandpassFilter from './FirBandpassFilter'
import HilbertTransform from './HilbertTransform'
import { normalizeArray } from './preprocess'

async function main() {
	const bufferSize = 1024
	const data = await loadCsv('/Users/ericyates/Downloads/muse-ppg.csv')
	const buffer = data.slice(0, bufferSize)

	const infrared = normalizeArray(buffer.map((row) => Number(row['Infrared'])))
	const timestamps = buffer.map((row) => Number(row['time by space']))

	// Remove low and high frequency noise from signal
	const filter = new FirBandpassFilter({
		numTaps: 257,
		sampleRate: 64,
		lowCutoffHz: 0.4,
		highCutoffHz: 4,
		attenuation: 50,
	})
	const hilbert = new HilbertTransform()

	// Remove low and high frequency noise
	const filteredData = filter.run(infrared)

	// Calculate the upper envelope
	const upperHilbert = hilbert.run(filteredData)
	const upperEnvelope = upperHilbert.map((value) => Math.abs(value))

	// Calculate the lower envelope
	const lowerHilbert = hilbert.run(upperHilbert)
	const lowerEnvelope = lowerHilbert.map((value) => Math.abs(value))

	// Define the peaks array with sample data or get it from somewhere
	const peaks = zeroOutWhereBGreater(filteredData, lowerEnvelope)

	// Initialization of chunks and current_chunk
	let chunks: { value: number; index: number }[][] = []
	let currentChunk: { value: number; index: number }[] = []

	// Processing to form chunks
	for (let i = 0; i < peaks.length; i++) {
		let value = peaks[i]
		if (value !== 0) {
			currentChunk.push({ value, index: i })
		} else {
			if (currentChunk.length > 0) {
				chunks.push(currentChunk)
				currentChunk = []
			}
		}
	}

	// Pushing the last chunk if it's not empty
	if (currentChunk.length > 0) {
		chunks.push(currentChunk)
	}

	// Initialization for max_values_and_indices
	let maxValuesAndIndices: { value: number; index: number }[] = []

	// Finding the maximum value and its index from each chunk
	for (let chunk of chunks) {
		if (chunk.length > 0) {
			const values = chunk.map((item) => item.value)
			const indices = chunk.map((item) => item.index)
			let maxValue = Math.max(...values)
			let maxIndex = values.findIndex((element) => element === maxValue)
			maxValuesAndIndices.push({ index: indices[maxIndex], value: maxValue })
		}
	}

	const plotData1 = [
		{
			x: timestamps,
			y: infrared,
		},
		{
			x: timestamps,
			y: filteredData,
		},
	]

	const plotData2 = [
		{
			x: timestamps,
			y: filteredData,
		},
		{
			x: timestamps,
			y: upperEnvelope,
		},
	]

	const plotData3 = [
		{
			x: timestamps,
			y: filteredData,
		},
		{
			x: timestamps,
			y: upperEnvelope,
		},
		{
			x: timestamps,
			y: lowerEnvelope,
		},
	]

	const plotData4 = [
		{
			x: timestamps,
			y: peaks,
		},
		{
			x: maxValuesAndIndices.map((t) => timestamps[t.index]),
			y: maxValuesAndIndices.map((t) => t.value),
		},
	]

	const plotData5 = [
		{
			x: timestamps,
			y: infrared,
		},
		{
			x: maxValuesAndIndices.map((t) => timestamps[t.index]),
			y: maxValuesAndIndices.map((t) => t.value),
		},
	]

	const width = 0
	plot(plotData1, { width })
	plot(plotData2, { width })
	plot(plotData3, { width })
	plot(plotData4, { width })
	plot(plotData5, { width })
}

function zeroOutWhereBGreater(arrayA: number[], arrayB: number[]): number[] {
	// Ensuring both arrays have the same length
	if (arrayA.length !== arrayB.length) {
		throw new Error('Arrays must have the same length')
	}

	// Creating a new array for the result to avoid mutating the input
	let resultArray = arrayA.slice()

	// Looping through the arrays and comparing each element
	for (let i = 0; i < arrayA.length; i++) {
		if (arrayB[i] > arrayA[i]) {
			// Zeroing out where element in arrayB is greater than in arrayA
			resultArray[i] = 0
		}
	}

	return resultArray
}

main()
