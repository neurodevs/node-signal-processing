export function padArrayWithZeros(
    signal: readonly number[],
    padLength: number
) {
    const zeros = new Array(padLength).fill(0)
    return zeros.concat(signal, zeros)
}

export function removeArrayPadding(
    signal: readonly number[],
    padLength: number
) {
    return signal.slice(padLength, signal.length - padLength)
}

export function normalizeArray(signal: readonly number[]) {
    const max = Math.max(...signal)
    const min = Math.min(...signal)

    return signal.map((value) => (value - min) / (max - min))
}
