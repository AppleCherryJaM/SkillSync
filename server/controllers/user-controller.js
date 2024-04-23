const HttpError = require("..models/HttpError");
const User = require("../models/user");
const validationResult = require("express-validator");

//private function
const _findByEmail = async(email) => {
	let result;
	try {
		result = await User.find({ email: email });
	} catch (error) {
		console.log(error);
		result = new HttpError(
			error.message,
			500
		);
	}
	return result;
}

//get all users
const getUsers = async(req, res, next) => {
	let users;
	try {
		users = await User.find({}, "email, firstName, lastName, phoneNumber"); //need to add CV
	} catch (error) {
		return next(
			new HttpError(
				error.message,
				500
			)
		);
	}
	res.status(200).json({
		users: users.map(
			user => user.toObject({
				getters: true
			})
		)
	});
}

const findUserByEmail = async(req, res, next) => {
	const {email} = req.body;
	const result = await _findByEmail(email);
	if (result.code === 500) {
		return next(result);
	}
	res.status(200).json({
		users: result.map(
			user => user.toObject({
				getters: true
			})
		)
	});
}

const findUserByName = async(req, res, next) => {
	const {firstName, lastName} = req.body;
	let searchResult, users;
	try {
		searchResult = await User.find({firstName, lastName});
		users = searchResult.map(
			user => user.toObject({
				getters: true
			})
		);
	} catch (error) {
		return next(
			new HttpError(
				error.message,
				500
			)
		);
	}
	if (Object.keys(users).length < 1) {
		return next(
			new HttpError(
				"Can not find users with this name",
				404
			)
		);
	}
	res.status(200).json({users});
}

const login = async (req, res, next) => {
	const { email, password } = req.body;

	const identifiedUser = await _findByEmail(email);

	if (!identifiedUser || identifiedUser.password !== password) {
		return next(
			new HttpError(
				'Could not identify user, credentials are wrong',
				401
			)
		);
	}

	res.json({ message: 'Logged in' }).status(200);
}

//create user
const signUp = async(req, res, next) => {
	const error = validationResult(req);

	if (!error.isEmpty) {
		return next(
			new HttpError('Invalid input', 422)
		);
	}

	const { firstName, lastName, email, password, phoneNumber } = req.body; // !!!add CV and avatar

	const isUserExist = Object.keys(await _findByEmail(email)).length > 0;
	if (isUserExist) {
		return next(
			new HttpError(
				"This email is already in use",
				422
			)
		);
	}

	const createdUser = new User({
		firstName, 
		lastName, 
		email, 
		password, 
		phoneNumber
	}); // !! need to add CV and avatar

	try {
		await createdUser.save();
	} catch (error) {
		return next(
			new HttpError(
				error.message,
				500
			)
		);
	}
	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

//update user
// const modifyUserField = async(req, res, next) => {
// 	const {email, firstName, lastName, }
// }