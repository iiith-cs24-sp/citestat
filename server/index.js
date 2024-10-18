const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.get("/api/ping", (req, res) => {
	res.status(200).send("pong");
});

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
