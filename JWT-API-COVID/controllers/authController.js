const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
	console.log(err.message, err.code);
	let errors = { email: '', password: '' };

	// incorrect email
	if (err.message === 'Incorrect Email') {
		errors.email = 'Entered Email Is Not Registered';
	}

	// incorrect password
	if (err.message === 'Incorrect Password') {
		errors.password = 'Entered Password Is Incorrect';
	}

	// duplicate email error
	if (err.code === 11000) {
		errors.email = 'Entered Email Is Already Registered';
		return errors;
	}

	// validation errors
	if (err.message.includes('user validation failed')) {
		// console.log(err);
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

// create json web token
// ! inactivity for more than 10 minutes logs the user out
const maxAge = 10 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, 'jwt-auth-task', {
		expiresIn: maxAge
	});
};

// controller actions
module.exports.signup_get = (req, res) => {
	res.render('signup');
};

module.exports.login_get = (req, res) => {
	res.render('login');
};

module.exports.signup_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.create({ email, password });
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.logout_get = (req, resp) => {
	resp.cookie('jwt', '', { maxAge: 1 });
	resp.redirect('/');
};
