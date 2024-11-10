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
    private sampleRate: number
    private lowCutoffHz: number
    private highCutoffHz: number
    private numTaps: number
    private attenuation: number
    private signal!: number[]
    private result!: number[]
    private filiFirFilter!: FiliFirFilter
    private filiFirCoeffs!: FiliFirCoeffs
    private firFilterCoeffs!: number[]

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

        this.sampleRate = sampleRate
        this.lowCutoffHz = lowCutoffHz
        this.highCutoffHz = highCutoffHz
        this.numTaps = numTaps
        this.attenuation = attenuation
        this.useNormalization = useNormalization
        this.usePadding = usePadding

        this.assertValidOptions()
        this.loadFiliFirFilter()
    }

    private assertValidOptions() {
        assertValidSampleRate(this.sampleRate)
        assertValidLowCutoffHz(this.lowCutoffHz)
        assertValidHighCutoffHz(this.highCutoffHz)
        assertHighFreqGreaterThanLowFreq(this.lowCutoffHz, this.highCutoffHz)
        assertValidNumTaps(this.numTaps)
        assertValidAttenuation(this.attenuation)
    }

    protected loadFiliFirFilter() {
        this.filiFirCoeffs = new FiliFirCoeffs()

        this.firFilterCoeffs = this.filiFirCoeffs.kbFilter({
            Fs: this.sampleRate,
            Fa: this.lowCutoffHz,
            Fb: this.highCutoffHz,
            order: this.numTaps,
            Att: this.attenuation,
        })

        this.filiFirFilter = this.FiliFirFilter()
    }

    public static Create(options: FirBandpassFilterOptions) {
        return new (this.Class ?? this)(options)
    }

    public run(signal: number[]) {
        this.signal = signal
        assertArrayIsNotEmpty(this.signal)

        this.resetFili()
        this.normalizeSignalIfEnabled()
        this.padSignalIfEnabled()
        this.runFilter()
        this.removePaddingIfEnabled()

        return this.result
    }

    private resetFili() {
        this.filiFirFilter.reinit()
    }

    private normalizeSignalIfEnabled() {
        if (this.useNormalization) {
            this.signal = normalizeArray(this.signal)
        }
    }

    private padSignalIfEnabled() {
        if (this.usePadding) {
            this.signal = padArrayWithZeros(this.signal, this.padLength)
        }
    }

    private runFilter() {
        this.result = this.filiFirFilter.filtfilt(this.signal)
    }

    private removePaddingIfEnabled() {
        if (this.usePadding) {
            this.result = removeArrayPadding(this.result, this.padLength)
        }
    }

    private get padLength() {
        return 3 * this.numTaps
    }

    private FiliFirFilter() {
        return new FiliFirFilter(this.firFilterCoeffs)
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
