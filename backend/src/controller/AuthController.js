const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
	async login(req, res) {
		const credentials = req.body;

		const user = User.getUserByCpfWithPassword(credentials.username, (err, user) => {
			if (user.length == 0) return res.status(400).send('Usuário não cadastrado');
			if (err) return res.status(401).send('Usuário ou senha inválidos');

			user = user[0];
			if (!(credentials.password == user.senha)) return res.status(401).send('Usuário ou senha inválidos');

			//Create token
			var token = null;
			var admin = false;
			if (credentials.username == 'admin') {
				token = jwt.sign({ id: user.cpf }, process.env.TOKEN_SECRET_ADMIN, {
					expiresIn: '1h'
				});
				admin = true;
				res.header('auth-token', token);
			} else {
				token = jwt.sign({ id: user.cpf }, process.env.TOKEN_SECRET, {
					expiresIn: '1h'
				});
				res.header('auth-token', token);
			}
			res.status(200).json({
				ok: true,
				token: token,
				admin: admin
			});
		});
	},
	async updatePassword(req, res) {
		const credentials = req.body;

		const user = User.getUserByCpfWithPassword(credentials.username, (err, user) => {
			if (err) return res.status(401).send('Senha inválida');

			user = user[0];
			if (!(credentials.passwordOld == user.senha)) return res.status(401).send('Senha inválida');

			User.updatePasswordByCpf(credentials.username, credentials.passwordNew, (err, user) => {
				return res.json({ ok: true });
			});
		});
	},
	async updatePasswordAdmin(req, res) {
		const credentials = req.body;

		const user = User.getUserByCpfWithPassword(credentials.username, (err, user) => {
			if (err) return res.status(401).send('Senha inválida');
			User.updatePasswordByCpf(credentials.username, '123456', (err, user) => {
				return res.json({ ok: true });
			});
		});
	}
};
