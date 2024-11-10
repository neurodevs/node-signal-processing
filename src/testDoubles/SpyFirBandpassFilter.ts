import FirBandpassFilter, {
    FirBandpassFilterOptions,
} from '../FirBandpassFilter'

export default class SpyFirBandpassFilter extends FirBandpassFilter {
    public constructor(options: FirBandpassFilterOptions) {
        super(options)
    }

    public getUsePadding() {
        return this.usePadding
    }

    public getUseNormalization() {
        return this.useNormalization
    }
}
