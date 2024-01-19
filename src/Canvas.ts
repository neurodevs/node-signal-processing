import { assertOptions } from '@sprucelabs/schema'
import { ChartConfiguration } from 'chart.js'
import {
	ChartJSNodeCanvas,
	ChartJSNodeCanvasOptions,
} from 'chartjs-node-canvas'

export default class Canvas {
	protected instance: ChartJSNodeCanvas

	public constructor(options: CanvasOptions) {
		assertOptions(options, ['width', 'height'])
		this.instance = new ChartJSNodeCanvas(options)
	}

	public render(options: RenderOptions) {
		const { configuration } = assertOptions(options, ['configuration'])
		this.instance.renderToBuffer(configuration)
	}
}

export interface CanvasOptions extends ChartJSNodeCanvasOptions {}
export interface RenderOptions {
	configuration: ChartConfiguration
	mimeType?: string
}
