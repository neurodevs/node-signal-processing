import {
    hilbertTransform,
    HilbertTransformFn,
} from '../../impl/hilbertTransform.js'
import { CallToHilbertTransform } from './createFakeHilbertTransform.js'

export function createSpyHilbertTransform(
    transform: HilbertTransformFn = hilbertTransform
) {
    const spy = ((signal, options) => {
        spy.calledWith.push({ signal, options })
        return transform(signal, options)
    }) as SpyHilbertTransform

    spy.calledWith = []

    return spy
}

export interface SpyHilbertTransform extends HilbertTransformFn {
    calledWith: CallToHilbertTransform[]
}
