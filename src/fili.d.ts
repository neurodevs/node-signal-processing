declare module 'fili' {
	export class FirCoeffs {
		public lowpass(params: FirCoeffsParams): number[]
		public highpass(params: FirCoeffsParams): number[]
		public bandstop(params: FirCoeffsParams): number[]
		public bandpass(params: FirCoeffsParams): number[]
		public kbFilter(params: FirCoeffsParams): number[]
		public available(): string[]
	}

	export interface FirCoeffsParams {
		Fs: number // Sampling frequency (Hz)
		Fa?: number // Start frequency for band filters (Hz)
		Fb?: number // Stop frequency for band filters (Hz)
		Fc?: number // Cutoff frequency for lowpass and highpass (Hz)
		order?: number // Filter order (number of taps, must be odd)
		Att?: number // Attenuation for Kaiser window (dB)
	}

	export class FirFilter {
		public constructor(filter: number[])

		public responsePoint(params: { Fs: number; Fr: number }): {
			magnitude: number
			phase: number
			dBmagnitude: number
		}

		public response(resolution?: number): Array<{
			magnitude: number
			phase: number
			dBmagnitude: number
		}>

		public simulate(input: number[]): number[]
		public singleStep(input: number): number
		public multiStep(input: number[], overwrite?: boolean): number[]
		public filtfilt(input: number[], overwrite?: boolean): number[]
		public reinit(): void
	}

	export class Fft {
		public length: number
		public buffer: number[]
		public re: number[]
		public im: number[]
		public reI: number[]
		public imI: number[]
		public twiddle: number[]
		public sinTable: number[]
		public cosTable: number[]

		public constructor(radix: number)

		public forward(b: number[], window: string): FiliComplexNumbers
		public inverse(re: number[], im: number[]): FiliComplexNumbers
		public magnitude(params: FiliComplexNumbers): number[]
		public magToDb(b: number[]): number[]
		public phase(params: FiliComplexNumbers): number[]
		public windows(): string[]
	}

	export interface WindowFunctionParams {
		name: string
		N: number
		a?: number
		n?: number
	}

	export interface FiliComplexNumbers {
		re: number[]
		im: number[]
	}
}
