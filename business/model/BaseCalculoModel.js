export class BaseCalculoModel {
    constructor(codigo) {
        this.salarioBase = null;
        this.baseCalcPrevidencia = null;
        this.basecalcFGTS = null;
        this.fgts = null;
        this.baseCalcIRRF = null;
    }

    toJSON() {
        let {
            salarioBase,
            baseCalcPrevidencia,
            basecalcFGTS,
            fgts,
            baseCalcIRRF
        } = this;
        return {
            salarioBase,
            baseCalcPrevidencia,
            basecalcFGTS,
            fgts,
            baseCalcIRRF
        };
    }
}