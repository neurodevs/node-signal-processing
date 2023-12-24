export function padArrayWithZeros(data: number[], padLength: number): number[] {
	const zeros = new Array(padLength).fill(0)
	return zeros.concat(data, zeros)
}

export function removeArrayPadding(
	data: number[],
	padLength: number
): number[] {
	return data.slice(padLength, data.length - padLength)
}

export function normalizeArray(data: number[]): number[] {
	const max = Math.max(...data)
	const min = Math.min(...data)

	return data.map((value) => (value - min) / (max - min))
}
