import {
    firBandpassFilter,
    FirBandpassFilterFn,
} from '../../impl/firBandpassFilter.js'
import { CallToFirBandpassFilter } from './createFakeFirBandpassFilter.js'

export function createSpyFirBandpassFilter(
    filter: FirBandpassFilterFn = firBandpassFilter
) {
    const spy = ((signal, options) => {
        spy.calledWith.push({ signal, options })
        return filter(signal, options)
    }) as SpyFirBandpassFilter

    spy.calledWith = []

    return spy
}

export interface SpyFirBandpassFilter extends FirBandpassFilterFn {
    calledWith: CallToFirBandpassFilter[]
}
