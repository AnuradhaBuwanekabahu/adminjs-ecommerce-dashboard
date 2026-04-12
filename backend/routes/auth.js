const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "secret"
  );

  res.json({ token, role: user.role });
});

module.exports = router;
