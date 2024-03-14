const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/list", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({}, "firstName lastName email"); // You can select specific fields if needed

        // Respond with the list of users
        res.json(users);
    } catch (error) {
        // If an error occurs, respond with a 500 status code and the error message
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
