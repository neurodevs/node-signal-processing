//exports go here

import { plot } from 'nodeplotlib'
import { loadCsv } from './__tests__/support/loader'
import FirBandpassFilter from './FirBandpassFilter'
import { HilbertTransform } from './HilbertTransform'
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
		attenuation: 10,
	})
	const filteredData = filter.run(infrared)

	const hilbert = new HilbertTransform()

	// Calculate the upper envelope
	const upperHilbert = hilbert.run(filteredData)
	const upperEnvelope = upperHilbert.im.map((value) => Math.abs(value))

	// Calculate the lower envelope
	const filteredUpperEnvelope = filter.run(upperEnvelope)
	const lowerHilbert = hilbert.run(filteredUpperEnvelope)
	const lowerEnvelope = lowerHilbert.im.map((value) => Math.abs(value))

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

	plot(plotData1)

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

	plot(plotData2)

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

	plot(plotData3)
}

main()
