import Canvas, { CanvasOptions, RenderOptions } from '../../Canvas'

export default class SpyCanvas extends Canvas {
	public static constructorOptions: CanvasOptions[] = []
	public static renderOptions: RenderOptions[] = []

	public constructor(options: CanvasOptions) {
		super(options)
		SpyCanvas.constructorOptions.push(options)
	}

	public getInstance() {
		return this.instance
	}

	public render(options: RenderOptions) {
		super.render(options)
		SpyCanvas.renderOptions.push(options)
	}
}
