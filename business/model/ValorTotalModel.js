export class ValorTotalModel {
    constructor() {
        this.vencimentos = null;
        this.descontos = null;
        this.liquido = null;
    }

    toJSON() {
        let { vencimentos, descontos, liquido } = this;
        return {
            vencimentos,
            descontos,
            liquido
        };
    }
}