import {
    ComplexNumbers,
    createFft,
    FftFactory,
    FftOptions,
} from '../../impl/createFft.js'

export function createSpyFftFactory(fftFactory: FftFactory = createFft) {
    const spy = ((options: FftOptions) => {
        spy.calledWith.push(options)

        const fft = fftFactory(options)

        return {
            forward(signal: readonly number[]) {
                spy.forwardCalledWith.push(signal)
                return fft.forward(signal)
            },

            inverse(signal: ComplexNumbers) {
                spy.inverseCalledWith.push(signal)
                return fft.inverse(signal)
            },
        }
    }) as SpyFftFactory

    spy.calledWith = []
    spy.forwardCalledWith = []
    spy.inverseCalledWith = []

    return spy
}

export interface SpyFftFactory extends FftFactory {
    calledWith: FftOptions[]
    forwardCalledWith: (readonly number[])[]
    inverseCalledWith: ComplexNumbers[]
}
