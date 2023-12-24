import { SchemaError } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'
import { isOddPositiveInt, isPositiveNumber, isPowerOfTwo } from './validations'

export function assertValidSampleRate(sampleRate: number): void {
	if (!isPositiveNumber(sampleRate)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['sampleRate'],
			friendlyMessage: 'Sample rate must be a positive number!',
		})
	}
}

export function assertValidLowCutoffHz(lowCutoffHz: number): void {
	if (!isPositiveNumber(lowCutoffHz)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['lowCutoffHz'],
			friendlyMessage: 'Low frequency cutoff must be a positive number!',
		})
	}
}

export function assertValidHighCutoffHz(highCutoffHz: number): void {
	if (!isPositiveNumber(highCutoffHz)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['highCutoffHz'],
			friendlyMessage: 'High frequency cutoff must be a positive number!',
		})
	}
}

export function assertHighFreqGreaterThanLowFreq(
	lowCutoffHz: number,
	highCutoffHz: number
): void {
	if (lowCutoffHz >= highCutoffHz) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['lowCutoffHz', 'highCutoffHz'],
			friendlyMessage:
				'High frequency cutoff must be greater than low frequency cutoff!',
		})
	}
}

export function assertValidNumTaps(numTaps: number): void {
	if (!isOddPositiveInt(numTaps)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['numTaps'],
			friendlyMessage: 'Number of taps must be an odd positive integer!',
		})
	}
}

export function assertValidAttenuation(attenuation: number): void {
	if (!isPositiveNumber(attenuation)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['attenuation'],
			friendlyMessage: 'Attenuation must be a positive number!',
		})
	}
}

export function assertValidRadix(radix: number): void {
	if (!isPowerOfTwo(radix)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['radix'],
			friendlyMessage: 'Radix must be a power of two!',
		})
	}
}

export function assertValidDataLength(data: number[], radix: number): void {
	if (data.length !== radix) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['radix', 'data'],
			friendlyMessage: 'Data must be same length as radix!',
		})
	}
}

export function assertArrayIsNotEmpty(data: number[]): void {
	if (data.length === 0) {
		throw new SpruceError({ code: 'INVALID_EMPTY_ARRAY' })
	}
}

export function assertArrayLengthIsPowerOfTwo(data: number[]): void {
	if (!isPowerOfTwo(data.length)) {
		throw new SchemaError({
			code: 'INVALID_PARAMETERS',
			parameters: ['data'],
			friendlyMessage:
				'Data for Hilbert transform must have length equal to a power of two!',
		})
	}
}
