import {
    ComplexNumbers,
    FftFactory,
    FftOptions,
} from '../../functions/createFft.js'

export function createFakeFftFactory(
    fakeForwardResult = createEmptyResult(),
    fakeInverseResult = createEmptyResult()
) {
    const fake = ((options: FftOptions) => {
        fake.calledWith.push(options)

        return {
            forward(signal: readonly number[]) {
                fake.forwardCalledWith.push(signal)
                return fake.fakeForwardResult
            },

            inverse(signal: ComplexNumbers) {
                fake.inverseCalledWith.push(signal)
                return fake.fakeInverseResult
            },
        }
    }) as FakeFftFactory

    fake.calledWith = []
    fake.forwardCalledWith = []
    fake.inverseCalledWith = []
    fake.fakeForwardResult = fakeForwardResult
    fake.fakeInverseResult = fakeInverseResult

    return fake
}

function createEmptyResult() {
    return {
        real: [],
        imaginary: [],
    } as ComplexNumbers
}

export interface FakeFftFactory extends FftFactory {
    calledWith: FftOptions[]
    forwardCalledWith: (readonly number[])[]
    inverseCalledWith: ComplexNumbers[]
    fakeForwardResult: ComplexNumbers
    fakeInverseResult: ComplexNumbers
}
