import Composite, { CompositeOptions } from '../../Composite'

export default class SpyComposite extends Composite {
	public static constructorOptions?: CompositeOptions

	public constructor(options: CompositeOptions) {
		super(options)
		SpyComposite.constructorOptions = options
	}
}
