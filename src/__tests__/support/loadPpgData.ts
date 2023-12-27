import { normalizeArray } from '../../preprocess'
import { loadCsv } from './loader'

export default async function loadPpgData() {
	const bufferSize = 1024
	const ppgData = await loadCsv('/Users/ericyates/Downloads/muse-ppg.csv')
	const buffer = ppgData.slice(0, bufferSize)

	const values = normalizeArray(buffer.map((row) => Number(row['Infrared'])))
	const timestamps = buffer.map((row) => Number(row['time by space']))

	return { values, timestamps }
}
