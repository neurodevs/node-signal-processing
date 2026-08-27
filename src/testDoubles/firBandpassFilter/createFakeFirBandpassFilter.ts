import {
    FirBandpassFilterFn,
    FirBandpassFilterOptions,
} from '../../impl/firBandpassFilter.js'

export function createFakeFirBandpassFilter(fakeResult: number[] = []) {
    const fake = ((signal, options) => {
        fake.calledWith.push({ signal, options })
        return fake.fakeResult
    }) as FakeFirBandpassFilter

    fake.calledWith = []
    fake.fakeResult = fakeResult

    return fake
}

export interface FakeFirBandpassFilter extends FirBandpassFilterFn {
    calledWith: CallToFirBandpassFilter[]
    fakeResult: number[]
}

export interface CallToFirBandpassFilter {
    signal: readonly number[]
    options: FirBandpassFilterOptions
}
