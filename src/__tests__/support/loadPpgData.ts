import { normalizeArray } from '../../preprocess'
import { loadCsv } from './loader'

export default async function loadPpgData(fileName: string) {
	const ppgData = await loadCsv(`src/__tests__/testData/${fileName}`)

	const values = normalizeArray(ppgData.map((row) => Number(row['infrared'])))
	const timestamps = ppgData.map((row) => Number(row['timestamp']))

	return { values, timestamps }
}
