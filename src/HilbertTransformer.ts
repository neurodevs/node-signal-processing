import Fft, { ComplexNumbers, FastFourierTransform } from './Fft'
import {
    assertArrayIsNotEmpty,
    assertArrayLengthIsPowerOfTwo,
} from './utils/assertions'

export default class HilbertTransformer implements HilbertTransform {
    public static Class?: HilbertTransformConstructor

    private signal!: number[]
    private fft!: FastFourierTransform
    private freqs!: ComplexNumbers
    private real!: number[]
    private imaginary!: number[]
    private filter!: number[]
    private result!: ComplexNumbers

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public run(signal: number[]) {
        this.signal = signal
        this.assertValidSignal()

        this.runForwardFft()
        this.setupHilbertFilter()
        this.applyFilterToSignal()
        this.runInverseFft()

        return this.results
    }

    private assertValidSignal() {
        assertArrayIsNotEmpty(this.signal)
        assertArrayLengthIsPowerOfTwo(this.signal)
    }

    private runForwardFft() {
        this.fft = this.Fft()

        this.freqs = this.fft.forward(this.signal)
        this.real = this.freqs.real.slice()
        this.imaginary = this.freqs.imaginary.slice()
    }

    private setupHilbertFilter() {
        this.filter = this.HilbertFilter()

        if (this.signalLengthIsEven) {
            this.updateFilterForEvenLength()
        } else {
            this.updateFilterForOddLength()
        }
    }

    private updateFilterForEvenLength() {
        this.doublePositiveFrequenciesForEven()
        this.setDcComponentToZero()
        this.setNyquistFrequencyToZero()
    }

    private updateFilterForOddLength() {
        this.doublePositiveFrequenciesForOdd()
        this.setDcComponentToZero()
    }

    private doublePositiveFrequenciesForEven() {
        for (let i = 1; i < this.signalLength / 2; i++) {
            this.filter[i] = 2
        }
    }

    private doublePositiveFrequenciesForOdd() {
        for (let i = 1; i < (this.signalLength + 1) / 2; i++) {
            this.filter[i] = 2
        }
    }

    private setDcComponentToZero() {
        this.filter[0] = 0
    }

    private setNyquistFrequencyToZero() {
        this.filter[this.signalLength / 2] = 0
    }

    private applyFilterToSignal() {
        for (let i = 0; i < this.signalLength; i++) {
            this.real[i] *= this.filter[i]
            this.imaginary[i] *= this.filter[i]
        }
    }

    private runInverseFft() {
        this.result = this.fft.inverse(this.complex)
    }

    private get signalLength() {
        return this.signal.length
    }

    private get signalLengthIsEven() {
        return this.signalLength % 2 == 0
    }

    private get complex() {
        return {
            real: this.real,
            imaginary: this.imaginary,
        } as ComplexNumbers
    }

    private get results() {
        return { analyticSignal: this.analyticSignal, envelope: this.envelope }
    }

    private get analyticSignal() {
        return this.result.imaginary
    }

    private get envelope() {
        return this.analyticSignal.map((value) => Math.abs(value))
    }

    private HilbertFilter() {
        return new Array(this.signalLength).fill(0)
    }

    private Fft() {
        return Fft.Create({ radix: this.signalLength })
    }
}

export interface HilbertTransform {
    run(data: number[]): HilbertTransformResults
}

export type HilbertTransformConstructor = new () => HilbertTransform

export interface HilbertTransformResults {
    analyticSignal: number[]
    envelope: number[]
}
