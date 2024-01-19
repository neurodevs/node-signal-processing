import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import Canvas from '../../Canvas'
import AbstractSignalProcessingTest from '../AbstractSignalProcessingTest'
import SpyCanvas from '../support/SpyCanvas'

export default class CanvasTest extends AbstractSignalProcessingTest {
	private static canvas: SpyCanvas

	protected static async beforeEach() {
		this.canvas = this.Canvas()
		assert.isTruthy(this.canvas)
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		//@ts-ignore
		const err = assert.doesThrow(() => new Canvas())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['width', 'height'],
		})
	}

	@test()
	protected static async renderThrowsWithMissingRequiredOptions() {
		//@ts-ignore
		const err = assert.doesThrow(() => this.canvas.render())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['configuration'],
		})
	}

	@test()
	protected static async instantiatesChartJSNodeCanvas() {
		assert.isInstanceOf(this.canvas.getInstance(), ChartJSNodeCanvas)
	}

	private static Canvas() {
		return new SpyCanvas({ width: 100, height: 100 })
	}
}
