export class ItensSalarioModel {
    constructor(codigo) {
        this.codigo = codigo;
        this.descricao = null;
        this.referencia = null;
        this.vencimentos = null;
        this.descontos = null;
    }

    toJSON() {
        let { codigo, descricao, referencia, vencimentos, descontos } = this;
        return {
            codigo,
            descricao,
            referencia,
            vencimentos,
            descontos
        };
    }
}