const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [ true, 'Please Enter An Email' ],
		unique: true,
		lowercase: true,
		validate: [ isEmail, 'Please Enter A Valid Email' ]
	},
	password: {
		type: String,
		required: [ true, 'Please Enter A Password' ],
		minlength: [ 6, 'Minimum Password Length Is 6 Characters' ]
	}
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Incorrect Password');
	}
	throw Error('Incorrect Email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
