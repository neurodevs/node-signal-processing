import PpgGrapher, {
	CreateSubplotOptions,
	CombineSubplotOptions,
} from '../../PpgGrapher'

export default class SpyPpgGrapher extends PpgGrapher {
	public static createSubplotOptions: CreateSubplotOptions[] = []
	public static combineSubplotsOptions: CombineSubplotOptions[] = []

	public async createSubplot(options: CreateSubplotOptions) {
		SpyPpgGrapher.createSubplotOptions.push(options)
		return await super.createSubplot(options)
	}

	public async combineSubplots(options: CombineSubplotOptions) {
		SpyPpgGrapher.combineSubplotsOptions.push(options)
		await super.combineSubplots(options)
	}
}
