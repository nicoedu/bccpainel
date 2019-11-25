export class FuncionarioDadosModel {
    constructor() {
        this.matricula = null;
        this.nome = null;
        this.cargo = null;
        this.cbo = null;
        this.cpf = null;
        this.departamento = null;
        this.banco = null;
        this.admissao = null;
    }

    toJSON() {
        let {
            matricula,
            nome,
            cargo,
            cbo,
            cpf,
            departamento,
            banco,
            admissao
        } = this;
        return {
            matricula,
            nome,
            cargo,
            cbo,
            cpf,
            departamento,
            banco,
            admissao
        };
    }
}