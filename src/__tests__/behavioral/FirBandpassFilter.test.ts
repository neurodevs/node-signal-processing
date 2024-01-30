import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import FirBandpassFilter from '../../FirBandpassFilter'
import { FirBandpassFilterOptions } from '../../types/nodeSignalProcessing.types'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyFirBandpassFilter from '../support/SpyFirBandpassFilter'

export default class FirBandpassFilterTest extends AbstractSignalProcessingTest {
	private static options: FirBandpassFilterOptions
	private static filter: SpyFirBandpassFilter
	private static testData = [1, 2, 3, 4]

	protected static async beforeEach() {
		await super.beforeEach()
		this.options = this.generateOptions()
		this.filter = this.Filter(this.options)
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => new FirBandpassFilter())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: [
				'sampleRate',
				'lowCutoffHz',
				'highCutoffHz',
				'numTaps',
				'attenuation',
			],
		})
	}

	@test()
	protected static async throwsWithInvalidSampleRate() {
		const invalidValues = [0, -1, -1.5]
		invalidValues.forEach((value) => this.assertInvalidSampleRate(value))
	}

	@test()
	protected static async throwsWithInvalidLowCutoffHz() {
		const invalidValues = [0, -1, -1.5]
		invalidValues.forEach((value) => this.assertInvalidLowCutoffHz(value))
	}

	@test()
	protected static async throwsWithInvalidighCutoffHz() {
		const invalidvalues = [0, -1, -1.5]
		invalidvalues.forEach((value) => this.assertInvalidHighCutoffHz(value))
	}

	@test()
	protected static async throwsWithLowFreqGreaterOrEqualToHighFreq() {
		this.assertInvalidFrequencies(10, 5)
		this.assertInvalidFrequencies(10, 10)
	}

	@test()
	protected static async throwsWithInvalidNumTaps() {
		const invalidValues = [0, -1, -1.5, 1.5, 2, 4, 6, 8]
		invalidValues.forEach((value) => this.assertInvalidNumTaps(value))
	}

	@test()
	protected static async throwsWithInvalidAttenuation() {
		const invalidValues = [0, -1, -1.5]
		invalidValues.forEach((value) => this.assertInvalidAttenuation(value))
	}

	@test()
	protected static throwsWhenRunReceivesEmptyList() {
		const err = assert.doesThrow(() => this.filter.run([]))
		errorAssert.assertError(err, 'INVALID_EMPTY_ARRAY')
	}

	@test()
	protected static async constructorSavesOptions() {
		assert.isNumber(this.filter.getSampleRate())
		assert.isNumber(this.filter.getLowCutoffHz())
		assert.isNumber(this.filter.getHighCutoffHz())
		assert.isNumber(this.filter.getNumTaps())
		assert.isNumber(this.filter.getAttenuation())
	}

	@test()
	protected static async loadFilterReturnsConfiguredFilter() {
		const filter = this.filter.load()
		assert.isTruthy(filter)
	}

	@test()
	protected static async runReturnsFilteredData() {
		const result = this.filter.run(this.testData)
		assert.isNotEqual(this.testData, result)
	}

	@test()
	protected static async runningTwiceReturnsSameResult() {
		const result1 = this.filter.run(this.testData)
		const result2 = this.filter.run(this.testData)
		assert.isEqualDeep(result1, result2)
	}

	@test()
	protected static async runAddsPaddingToDataByDefault() {
		const resultWithPadding = this.filter.run(this.testData)
		const resultWithoutPadding = this.filter.run(this.testData, {
			usePadding: false,
		})
		assert.isNotEqualDeep(resultWithPadding, resultWithoutPadding)
	}

	@test()
	protected static async runNormalizesDataByDefault() {
		const resultWithNormalization = this.filter.run(this.testData)
		const resultWithoutNormalization = this.filter.run(this.testData, {
			useNormalization: false,
		})
		assert.isNotEqualDeep(resultWithNormalization, resultWithoutNormalization)
	}

	private static Filter(
		options: Partial<FirBandpassFilterOptions>
	): SpyFirBandpassFilter {
		const defaultOptions = this.generateOptions()
		return new SpyFirBandpassFilter({
			...defaultOptions,
			...options,
		})
	}

	private static assertInvalidSampleRate(sampleRate: number) {
		this.assertDoesThrowInvalidParameters({ sampleRate }, ['sampleRate'])
	}

	private static assertInvalidLowCutoffHz(lowCutoffHz: number) {
		this.assertDoesThrowInvalidParameters({ lowCutoffHz }, ['lowCutoffHz'])
	}

	private static assertInvalidHighCutoffHz(highCutoffHz: number) {
		this.assertDoesThrowInvalidParameters({ highCutoffHz }, ['highCutoffHz'])
	}

	private static assertInvalidFrequencies(
		lowCutoffHz: number,
		highCutoffHz: number
	) {
		this.assertDoesThrowInvalidParameters({ lowCutoffHz, highCutoffHz }, [
			'lowCutoffHz',
			'highCutoffHz',
		])
	}

	private static assertInvalidNumTaps(numTaps: number) {
		this.assertDoesThrowInvalidParameters({ numTaps }, ['numTaps'])
	}

	private static async assertInvalidAttenuation(attenuation: number) {
		this.assertDoesThrowInvalidParameters({ attenuation }, ['attenuation'])
	}

	private static assertDoesThrowInvalidParameters(
		options: Partial<FirBandpassFilterOptions>,
		parameters: string[]
	) {
		const err = assert.doesThrow(() => this.Filter(options))
		errorAssert.assertError(err, 'INVALID_PARAMETERS', {
			parameters,
		})
	}

	private static generateOptions() {
		const lowCutoffHz = Math.random()
		const highCutoffHz = 10 * lowCutoffHz
		return {
			sampleRate: 100 * Math.random(),
			lowCutoffHz,
			highCutoffHz,
			numTaps: 101,
			attenuation: 50,
		}
	}
}
