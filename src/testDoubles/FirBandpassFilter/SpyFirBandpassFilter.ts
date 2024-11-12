import FirBandpassFilter, {
    FirBandpassFilterOptions,
} from '../../components/FirBandpassFilter'

export default class SpyFirBandpassFilter extends FirBandpassFilter {
    public static callsToConstructor: FirBandpassFilterOptions[] = []
    public static callsToRun: number[][] = []

    public constructor(options: FirBandpassFilterOptions) {
        super(options)
        this.callsToConstructor.push(options)
    }

    public run(signal: number[]) {
        SpyFirBandpassFilter.callsToRun.push(signal)
        return super.run(signal)
    }

    public getUsePadding() {
        return this.usePadding
    }

    public getUseNormalization() {
        return this.useNormalization
    }

    public get callsToConstructor() {
        return SpyFirBandpassFilter.callsToConstructor
    }
}
