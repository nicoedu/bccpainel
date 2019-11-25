class ContrachequeModel {
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
        self.cpf = cpf;
        self.data = data;
        self.departamento = departamento;
        self.matricula = matricula;
        self.nome = nome;
        self.cargo = cargo;
        self.cbo = cbo;
        self.dadosBanco = dadosBanco;
        self.admissao = admissao;
        self.totalVencimentos = totalVencimentos;
        self.totalDescontos = totalDescontos;
        self.totalLiquido = totalLiquido;
        self.salarioBase = salarioBase;
        self.baseCalcPrevidencia = baseCalcPrevidencia;
        self.basecalcFGTS = basecalcFGTS;
        self.fgts = fgts;
        self.baseCalcIRRF = baseCalcIRRF;
    }
}

class itensSalario {
    constructor(codigo, descricao, referencia, vencimentos, descontos) {
        self.codigo = codigo;
        self.descricao = descricao;
        self.referencia = referencia;
        self.vencimentos = vencimentos;
        self.descontos = descontos;
    }
}