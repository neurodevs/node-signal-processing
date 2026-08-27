import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import {
    assertArrayIsNotEmpty,
    assertHighFreqGreaterThanLowFreq,
    assertValidAttenuation,
    assertValidHighCutoffHz,
    assertValidLowCutoffHz,
    assertValidNumTaps,
    assertValidSampleRate,
} from '../utils/assertions.js'
import {
    normalizeArray,
    padArrayWithZeros,
    removeArrayPadding,
} from '../utils/preprocess.js'

const {
    FirCoeffs: FiliFirCoeffs,
    FirFilter: FiliFirFilter,
} = require('@neurodevs/fili')

export function firBandpassFilter(
    signal: readonly number[],
    options: FirBandpassFilterOptions
): number[] {
    const { numTaps, useNormalization = true, usePadding = true } = options

    assertValidOptions(options)
    assertArrayIsNotEmpty(signal)

    const filiFirFilter = createFiliFirFilter(options)
    const padLength = 3 * numTaps

    let preprocessed = useNormalization ? normalizeArray(signal) : signal

    if (usePadding) {
        preprocessed = padArrayWithZeros(preprocessed, padLength)
    }

    const result = filiFirFilter.filtfilt(preprocessed) as number[]

    return usePadding ? removeArrayPadding(result, padLength) : result
}

function assertValidOptions(options: FirBandpassFilterOptions) {
    const { sampleRate, lowCutoffHz, highCutoffHz, numTaps, attenuation } =
        options

    assertValidSampleRate(sampleRate)
    assertValidLowCutoffHz(lowCutoffHz)
    assertValidHighCutoffHz(highCutoffHz)
    assertHighFreqGreaterThanLowFreq(lowCutoffHz, highCutoffHz)
    assertValidNumTaps(numTaps)
    assertValidAttenuation(attenuation)
}

function createFiliFirFilter(options: FirBandpassFilterOptions) {
    const { sampleRate, lowCutoffHz, highCutoffHz, numTaps, attenuation } =
        options

    const firFilterCoeffs = new FiliFirCoeffs().kbFilter({
        Fs: sampleRate,
        Fa: lowCutoffHz,
        Fb: highCutoffHz,
        order: numTaps,
        Att: attenuation,
    })

    return new FiliFirFilter(firFilterCoeffs)
}

export type FirBandpassFilterFn = (
    signal: readonly number[],
    options: FirBandpassFilterOptions
) => number[]

export interface FirBandpassFilterOptions {
    sampleRate: number
    lowCutoffHz: number
    highCutoffHz: number
    numTaps: number
    attenuation: number
    usePadding?: boolean
    useNormalization?: boolean
}
