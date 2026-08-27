import { detectPeaks, DetectPeaksFn } from '../../functions/detectPeaks.js'
import { CallToDetectPeaks } from './createFakeDetectPeaks.js'

export function createSpyDetectPeaks(detect: DetectPeaksFn = detectPeaks) {
    const spy = ((filteredSignal, timestamps, options) => {
        spy.calledWith.push({ filteredSignal, timestamps, options })
        return detect(filteredSignal, timestamps, options)
    }) as SpyDetectPeaks

    spy.calledWith = []

    return spy
}

export interface SpyDetectPeaks extends DetectPeaksFn {
    calledWith: CallToDetectPeaks[]
}
