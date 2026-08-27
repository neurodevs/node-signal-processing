import {
    detectHilbertPeaks,
    DetectHilbertPeaksFn,
} from '../../impl/detectHilbertPeaks.js'
import { CallToDetectHilbertPeaks } from './createFakeDetectHilbertPeaks.js'

export function createSpyDetectHilbertPeaks(
    detect: DetectHilbertPeaksFn = detectHilbertPeaks
) {
    const spy = ((filteredSignal, timestamps, options) => {
        spy.calledWith.push({ filteredSignal, timestamps, options })
        return detect(filteredSignal, timestamps, options)
    }) as SpyDetectHilbertPeaks

    spy.calledWith = []

    return spy
}

export interface SpyDetectHilbertPeaks extends DetectHilbertPeaksFn {
    calledWith: CallToDetectHilbertPeaks[]
}
