export function maxOfArray(values: readonly number[]) {
    let max = -Infinity

    for (const value of values) {
        if (Number.isNaN(value)) {
            return NaN
        }
        if (value > max) {
            max = value
        }
    }

    return max
}

export function minOfArray(values: readonly number[]) {
    let min = Infinity

    for (const value of values) {
        if (Number.isNaN(value)) {
            return NaN
        }
        if (value < min) {
            min = value
        }
    }

    return min
}
