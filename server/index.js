require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const app = express();

app.use((req, res, next) => {
	console.log("Server started")
	res.json({message: "Server started"});
});

app.listen(PORT)
