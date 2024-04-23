const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: 'string', required: true },
	lastName: { type: 'string', required: true },
	phoneNumber: { type: 'string', required: true, unique: true },
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

module.exports = mongoose.model("User", userSchema);