import express from "express";
import session from "express-session";
const router = express.Router();
import { userDB } from "../modules/userDB.js";

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const diaryCollection = [];

    const userToInsert = {
      username: username,
      email: email,
      password: password,
      diaries: diaryCollection,
    };

    const result = await userDB.insertUser(userToInsert);

    res.json({ message: "User inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await userDB.verifyUser(username, password);

    if (result.success) {
      req.session.user = { username: username };
      console.log(res.status);
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      console.log("Authentication failed:", result.message);
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("An error occurred during user verification:", error);

    console.error("Error during verification:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log("Successfully log out");
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

export default router;
