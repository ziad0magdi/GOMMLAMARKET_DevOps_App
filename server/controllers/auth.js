const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UsersModel = require("../models/Users");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

class authController {
  // User Sign-In
  static async signIn(req, res) {
    const { user_email, user_password } = req.body;

    try {
      // Fetch user by email
      const results = await UsersModel.getUserByEmail(user_email);

      if (!results) {
        return res.status(401).json({ Error: "Invalid email or password" });
      }

      const results2 = await UsersModel.getUserPasswordByEmail(user_email);

      const user_Query_password = results2;

      // Compare hashed password with bcrypt
      const isPasswordValid = await bcrypt.compare(
        user_password,
        user_Query_password.user_password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ Error: "Invalid email or password" });
      }

      const results3 = await UsersModel.getUserInfoByEmail(user_email);

      const user = results3;

      // Generate JWT token
      const token = jwt.sign(
        { user_id: user.user_id, user_group_id: user.user_group_id },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set token in HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3600000, // 1 hour in milliseconds
      });

      // Respond with success and user details
      return res.status(200).json({
        Status: "Success",
        user_group_id: user.user_group_id,
        user_id: user.user_id,
        user_department_id: user.user_department_id,
      });
    } catch (err) {
      console.error("Error during sign-in:", err);
      return res.status(500).json({ Error: "Internal server error" });
    }
  }

  static async verifyToken(req, res) {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({
        isAuthenticated: true,
        user_group_id: decoded.user_group_id,
        user_id: decoded.user_id,
      });
    } catch (err) {
      return res.status(401).json({ isAuthenticated: false });
    }
  }

  static async getUser(req, res) {
    try {
      const { user_id, user_group_id } = req.user;
      return res.status(200).json({ user_id, user_group_id });
    } catch (err) {
      return res.status(500).json({ Error: "Internal server error" });
    }
  }
}

module.exports = authController;
