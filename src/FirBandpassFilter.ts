import { assertOptions } from '@sprucelabs/schema'
import {
    FirCoeffs as FiliFirCoeffs,
    FirFilter as FiliFirFilter,
} from '@neurodevs/fili'
import {
    assertArrayIsNotEmpty,
    assertHighFreqGreaterThanLowFreq,
    assertValidAttenuation,
    assertValidHighCutoffHz,
    assertValidLowCutoffHz,
    assertValidNumTaps,
    assertValidSampleRate,
} from './assertions'
import {
    normalizeArray,
    padArrayWithZeros,
    removeArrayPadding,
} from './preprocess'

export default class FirBandpassFilter implements Filter {
    public static Class?: FirBandpassFilterConstructor

    protected useNormalization: boolean
    protected usePadding: boolean
    private filiFilter: FiliFirFilter
    private sampleRate: number
    private lowCutoffHz: number
    private highCutoffHz: number
    private numTaps: number
    private attenuation: number

    protected constructor(options: FirBandpassFilterOptions) {
        const {
            sampleRate,
            lowCutoffHz,
            highCutoffHz,
            numTaps,
            attenuation,
            useNormalization = true,
            usePadding = true,
        } = assertOptions(options, [
            'sampleRate',
            'lowCutoffHz',
            'highCutoffHz',
            'numTaps',
            'attenuation',
        ])

        this.assertValidOptions(options)

        this.sampleRate = sampleRate
        this.lowCutoffHz = lowCutoffHz
        this.highCutoffHz = highCutoffHz
        this.numTaps = numTaps
        this.attenuation = attenuation
        this.useNormalization = useNormalization
        this.usePadding = usePadding

        this.filiFilter = this.load()
    }

    public static Create(options: FirBandpassFilterOptions) {
        return new (this.Class ?? this)(options)
    }

    private assertValidOptions(options: FirBandpassFilterOptions) {
        const { sampleRate, lowCutoffHz, highCutoffHz, numTaps, attenuation } =
            options

        assertValidSampleRate(sampleRate)
        assertValidLowCutoffHz(lowCutoffHz)
        assertValidHighCutoffHz(highCutoffHz)
        assertHighFreqGreaterThanLowFreq(lowCutoffHz, highCutoffHz)
        assertValidNumTaps(numTaps)
        assertValidAttenuation(attenuation)
    }

    public run(data: number[]) {
        assertArrayIsNotEmpty(data)
        this.filiFilter.reinit()

        if (this.useNormalization) {
            data = normalizeArray(data)
        }

        let result

        if (this.usePadding) {
            const padLength = 3 * this.numTaps
            const padded = padArrayWithZeros(data, padLength)
            const resultPadded = this.filiFilter.filtfilt(padded)
            result = removeArrayPadding(resultPadded, padLength)
        } else {
            result = this.filiFilter.filtfilt(data)
        }

        return result
    }

    protected load() {
        let firCoeffsCalculator = new FiliFirCoeffs()

        let firFilterCoeffs = firCoeffsCalculator.kbFilter({
            Fs: this.sampleRate,
            Fa: this.lowCutoffHz,
            Fb: this.highCutoffHz,
            order: this.numTaps,
            Att: this.attenuation,
        })

        return this.FirFilter(firFilterCoeffs)
    }

    private FirFilter(firFilterCoeffs: number[]) {
        return new FiliFirFilter(firFilterCoeffs)
    }
}

export interface Filter {
    run(data: number[]): number[]
}

export type FirBandpassFilterConstructor = new (
    options: FirBandpassFilterOptions
) => Filter

export interface FirBandpassFilterOptions {
    sampleRate: number
    lowCutoffHz: number
    highCutoffHz: number
    numTaps: number
    attenuation: number
    usePadding?: boolean
    useNormalization?: boolean
}
