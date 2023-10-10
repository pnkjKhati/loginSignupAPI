const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All Fields are mandatory");
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.name,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Email or Password are not valid!");
    }
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const id = uuid();
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All Fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already Exist!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    id,
    password: hashedPassword,
  });
  if (user) {
    const accessToken = jwt.sign(
      { user: { username, email, id } },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.status(201).json({
      statusCode: 201,
      message: "Success",
      data: {
        accessToken,
        ...user._doc,
      },
    });
  } else {
    res.status(400).json({ message: "User data doesn't valid" });
  }
});

module.exports = { loginUser, registerUser };
