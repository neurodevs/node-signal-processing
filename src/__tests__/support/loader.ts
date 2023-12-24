import * as fs from 'fs'
import { parse } from 'fast-csv'

export async function loadCsv(filePath: string): Promise<CsvRow[]> {
	return new Promise((resolve, reject) => {
		const results: CsvRow[] = []

		fs.createReadStream(filePath)
			.pipe(parse({ headers: true }))
			.on('data', (row: CsvRow) => results.push(row))
			.on('end', () => resolve(results))
			.on('error', (error) => reject(error))
	})
}

interface CsvRow {
	[header: string]: string
}
