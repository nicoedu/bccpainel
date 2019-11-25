export class ContrachequeModel {
    constructor(
        cpf,
        data,
        departamento,
        matricula,
        nome,
        cargo,
        cbo,
        dadosBanco,
        admissao,
        totalVencimentos,
        totalDescontos,
        totalLiquido,
        salarioBase,
        baseCalcPrevidencia,
        basecalcFGTS,
        fgts,
        baseCalcIRRF
    ) {
        this.cpf = cpf;
        this.data = data;
        this.departamento = departamento;
        this.matricula = matricula;
        this.nome = nome;
        this.cargo = cargo;
        this.cbo = cbo;
        this.dadosBanco = dadosBanco;
        this.admissao = admissao;
        this.totalVencimentos = totalVencimentos;
        this.totalDescontos = totalDescontos;
        this.totalLiquido = totalLiquido;
        this.salarioBase = salarioBase;
        this.baseCalcPrevidencia = baseCalcPrevidencia;
        this.basecalcFGTS = basecalcFGTS;
        this.fgts = fgts;
        this.baseCalcIRRF = baseCalcIRRF;
    }
}