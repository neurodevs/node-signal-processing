![npm version](https://img.shields.io/npm/v/@neurodevs/node-signal-processing)

# node-signal-processing
Object-oriented algorithms for digital signal processing.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [Fft](#fft)
  - [FirBandpassFilter](#firbandpassfilter)
  - [HilbertPeakDetector](#hilbertpeakdetector)
  - [HilbertTransformer](#hilberttransformer)

## Overview

This package contains object-oriented algorithms for digital signal processing.

## Installation

Install the package with your preferred package manager, such as:

`npm install @neurodevs/node-signal-processing` 

or:

`yarn add @neurodevs/node-signal-processing`

## Usage

### Fft

```typescript
import { Fft } from '@neurodevs/node-signal-processing'

function runFftForwardAndInverse() {
    const signal = [1, 2, 3, 4]

    const fft = Fft.Create({ radix: signal.length })
    const frequencies = fft.forward(signal)
    const original = fft.inverse(frequencies)
}
```

### FirBandpassFilter

```typescript
import { FirBandpassFilter } from '@neurodevs/node-signal-processing'

function filterLowAndHighFrequenciesFromPpgSignal() {

    const rawPpgSignal: number[] = [...]

    const filter = FirBandpassFilter.Create({
        sampleRate: 64,       // PPG sample rate
        lowCutoffHz: 0.4,     // Filter under 24 bpm heart rate
        highCutoffHz: 4.0,    // Filter over 240 bpm heart rate
        numTaps: 4 * 64 + 1,  // Heuristic: 4 * sampleRate + 1
        attenuation: 50       // Frequencies outside bandpass reduced by 50 dB
    })

    const filteredPpgSignal = filter.run(rawPpgSignal)
}
```

### HilbertPeakDetector

```typescript
import { HilbertPeakDetector } from '@neurodevs/node-signal-processing'

function detectPpgPeaksFromFilteredSignal() {
    const filteredPpgSignal: number[] = [...]  // See FirBandpassFilter example
    const timestamps: number[] = [...]         // Must be same length as filteredPpgSignal

    const detector = HilbertPeakDetector.Create()
    const results = detector.run(filteredPpgSignal, timestamps)
}
```

### HilbertTransformer

```typescript
import { HilbertTransformer } from '@neurodevs/node-signal-processing'

function calculateAnalyticSignalAndEnvelopeFromSignal() {
    const signal = [1, 2, 3, 4]

    const transformer = HilbertTransformer.Create()
    const { analyticSignal, envelope } = transformer.run(signal)
}
```
