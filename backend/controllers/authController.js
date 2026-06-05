const User = require("../models/User");
const generateToken = require("../config/generateToken");
const {
  normalizeString,
  normalizePhone,
  normalizeEmail,
  normalizeAge,
} = require("../utils/validators");

const buildUserResponse = (user) => {
  return {
    _id: user._id.toString(),
    name: user.fullName,
    phone: user.phoneNumber,
    fatherName: user.fatherName,
    email: user.email,
    address: user.address,
    age: user.age,
    gender: user.gender,
    role: user.role,
  };
};

const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      name,
      phoneNumber,
      phone,
      fatherName,
      email,
      address,
      age,
      gender,
      password,
    } = req.body;

    const resolvedFullName = normalizeString(fullName || name);
    const resolvedPhoneNumber = normalizePhone(phoneNumber || phone);
    const resolvedFatherName = normalizeString(fatherName);
    const resolvedEmail = normalizeEmail(email);
    const resolvedAddress = normalizeString(address);
    const resolvedAge = normalizeAge(age);
    const resolvedGender = normalizeString(gender)?.toLowerCase();

    if (!resolvedFullName || !resolvedPhoneNumber || !resolvedFatherName || !password) {
      return res.status(400).json({
        message: "Full name, phone number, father/guardian name, and password are required",
      });
    }

    if (resolvedPhoneNumber === null) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }

    if (resolvedFullName.length < 2 || resolvedFatherName.length < 2) {
      return res.status(400).json({
        message: "Names must be at least 2 characters long",
      });
    }

    if (resolvedEmail === null) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    if (resolvedAge === null) {
      return res.status(400).json({
        message: "Age must be a whole number between 1 and 120",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (resolvedGender && !["male", "female", "other"].includes(resolvedGender)) {
      return res.status(400).json({
        message: "Select a valid gender option",
      });
    }

    const existingFilters = [{ phoneNumber: resolvedPhoneNumber }];

    if (resolvedEmail) {
      existingFilters.push({ email: resolvedEmail });
    }

    const existingUser = await User.findOne({ $or: existingFilters });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this phone number or email already exists",
      });
    }

    const user = await User.create({
      fullName: resolvedFullName,
      phoneNumber: resolvedPhoneNumber,
      fatherName: resolvedFatherName,
      email: resolvedEmail,
      address: resolvedAddress,
      age: resolvedAge,
      gender: resolvedGender,
      password,
      role: "user",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { identifier, phoneNumber, phone, email, password } = req.body;
    const resolvedIdentifier = normalizeString(
      identifier || phoneNumber || phone || email,
    );

    if (!resolvedIdentifier || !password) {
      return res.status(400).json({
        message: "Phone number or email and password are required",
      });
    }

    const loginQuery = resolvedIdentifier.includes("@")
      ? { email: normalizeEmail(resolvedIdentifier) }
      : { phoneNumber: normalizePhone(resolvedIdentifier) };

    if (!loginQuery.email && !loginQuery.phoneNumber) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number or email address",
      });
    }

    const user = await User.findOne(loginQuery);

    if (!user) {
      return res.status(401).json({
        message: "Invalid login credentials",
      });
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid login credentials",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      message: "Profile fetched successfully",
      user: buildUserResponse(req.user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
