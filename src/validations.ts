export function isPositiveNumber(value: number): boolean {
    return value > 0
}

export function isPositiveInt(value: number): boolean {
    return value > 0 && Number.isInteger(value)
}

export function isOddPositiveInt(value: number): boolean {
    return isPositiveInt(value) && value % 2 !== 0
}

export function isPowerOfTwo(value: number): boolean {
    return isPositiveInt(value) && (value & (value - 1)) === 0
}
