import {
    isOddPositiveInt,
    isPositiveNumber,
    isPowerOfTwo,
} from './validations.js'

export function assertValidSampleRate(sampleRate: number): void {
    if (!isPositiveNumber(sampleRate)) {
        throw new Error('Sample rate must be a positive number!')
    }
}

export function assertValidLowCutoffHz(lowCutoffHz: number): void {
    if (!isPositiveNumber(lowCutoffHz)) {
        throw new Error('Low frequency cutoff must be a positive number!')
    }
}

export function assertValidHighCutoffHz(highCutoffHz: number): void {
    if (!isPositiveNumber(highCutoffHz)) {
        throw new Error('High frequency cutoff must be a positive number!')
    }
}

export function assertHighFreqGreaterThanLowFreq(
    lowCutoffHz: number,
    highCutoffHz: number
): void {
    if (lowCutoffHz >= highCutoffHz) {
        throw new Error(
            'High frequency cutoff must be greater than low frequency cutoff!'
        )
    }
}

export function assertValidNumTaps(numTaps: number): void {
    if (!isOddPositiveInt(numTaps)) {
        throw new Error('Number of taps must be an odd positive integer!')
    }
}

export function assertValidAttenuation(attenuation: number): void {
    if (!isPositiveNumber(attenuation)) {
        throw new Error('Attenuation must be a positive number!')
    }
}

export function assertValidRadix(radix: number): void {
    if (!isPowerOfTwo(radix)) {
        throw new Error('Radix must be a power of two!')
    }
}

export function assertValidDataLength(signal: number[], radix: number): void {
    if (signal.length !== radix) {
        throw new Error('Data must be same length as radix!')
    }
}

export function assertArrayIsNotEmpty(signal: number[]): void {
    if (signal.length === 0) {
        throw new Error('Array cannot be empty!')
    }
}

export function assertArrayLengthIsPowerOfTwo(signal: number[]): void {
    if (!isPowerOfTwo(signal.length)) {
        throw new Error(
            'Data for Hilbert transform must have length equal to a power of two!'
        )
    }
}
