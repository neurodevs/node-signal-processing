import {
    HilbertTransformFn,
    HilbertTransformOptions,
    HilbertTransformResults,
} from '../../functions/hilbertTransform.js'

export function createFakeHilbertTransform(fakeResult = createEmptyResult()) {
    const fake = ((signal, options) => {
        fake.calledWith.push({ signal, options })
        return fake.fakeResult
    }) as FakeHilbertTransform

    fake.calledWith = []
    fake.fakeResult = fakeResult

    return fake
}

function createEmptyResult() {
    return {
        analyticSignal: [],
        envelope: [],
    } as HilbertTransformResults
}

export interface FakeHilbertTransform extends HilbertTransformFn {
    calledWith: CallToHilbertTransform[]
    fakeResult: HilbertTransformResults
}

export interface CallToHilbertTransform {
    signal: readonly number[]
    options?: HilbertTransformOptions
}
