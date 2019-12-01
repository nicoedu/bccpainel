const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
    async login(req, res) {
        const credentials = req.body;

        const user = User.getUserByCpfWithPassword(
            credentials.username,
            (err, user) => {
                if (err) return res.status(401).send("Usuário ou senha inválidos");

                user = user[0];
                if (!(credentials.password == user.senha))
                    return res.status(401).send("Usuário ou senha inválidos");

                //Create token
                var token = null;
                if (user.departamento == "001") {
                    token = jwt.sign({ id: user.cpf }, process.env.TOKEN_SECRET);
                    res.header("auth-token", token);
                }
                return res.json({ ok: true, token: token });
            }
        );
    },
    async updatePassword(req, res) {
        const credentials = req.body;

        const user = User.getUserByCpfWithPassword(
            credentials.username,
            (err, user) => {
                if (err) return res.status(401).send("Senha inválida");

                user = user[0];
                if (!(credentials.passwordOld == user.senha))
                    return res.status(401).send("Senha inválida");

                User.updatePasswordByCpf(
                    credentials.username,
                    credentials.passwordNew,
                    (err, user) => {
                        return res.json({ ok: true });
                    }
                );
            }
        );
    }
};