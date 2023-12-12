import express from "express";
const router = express.Router();
import { userDB } from "../modules/userDB.js";
import passport from "passport";
import crypto from "crypto";

router.post("/login/password", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(500).json({ message: "An error occurred" });
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "An error occurred" });
      }
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

router.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const diaryCollection = [];
    const maxId = await userDB.getMax();

    const salt = crypto.randomBytes(16).toString("hex");

    crypto.pbkdf2(
      password,
      salt,
      1000,
      64,
      "sha512",
      async (err, hashedPassword) => {
        if (err) throw err;

        const userToInsert = {
          id: maxId + 1,
          username: username,
          email: email,
          salt: salt,
          hashed_password: hashedPassword.toString("hex"),
          diaries: diaryCollection,
        };

        const result = await userDB.insertUser(userToInsert);

        res.json({ message: "User inserted successfully", result });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log("Successfully logged out");
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

router.post("/postDiary", async (req, res) => {
  try {
    const { id } = req.query;
    const { title, content } = req.body;

    const newDiary = {
      id: parseInt(await userDB.getNextDiaryId(id)) + 1,
      userId: id,
      title: title,
      content: content,
    };
    console.log("newDiary:", newDiary);

    const result = await userDB.postDiary(id, newDiary);
    console.log("result.status:", result.status);
    if (result.status === 200) {
      res.json(result.diariesCollection);
    } else {
      res.status(result.status).json(result.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/diaries", async (req, res) => {
  try {
    const { id } = req.query;

    const result = await userDB.getDiaries(id);
    console.log("result.status:", result.status);
    if (result.status === 200) {
      res.json(result.diariesCollection);
    } else {
      res.status(result.status).json(result.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/deleteDiary/:diaryId", async (req, res) => {
  const { id } = req.query;
  const diaryId = req.params.diaryId;

  try {
    const result = await userDB.deleteDiary(id, diaryId);
    if (result.status === 200) {
      res.status(200).json({ message: "Diary deleted successfully" });
    } else if (result.status === 404) {
      res.status(404).json({ message: "Diary not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getDiary/:userId/:diaryId", async (req, res) => {
  const userId = req.params.userId;
  const diaryId = req.params.diaryId;

  try {
    const result = await userDB.getDiary(userId, diaryId);
    if (result.status === 200) {
      res.status(200).json(result.diary);
    } else if (result.status === 404) {
      res.status(404).json({ message: "Diary not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/edit/:userId/:diaryId", async (req, res) => {
  const userId = req.params.userId;
  const diaryId = parseInt(req.params.diaryId);
  const { title, content } = req.body;

  const newDiary = {
    id: diaryId,
    userId: userId,
    title: title,
    content: content,
  };

  try {
    const result = await userDB.editDiary(userId, diaryId, newDiary);
    if (result.status === 200) {
      res.status(200).json({ message: "Diary edited successfully" });
    } else if (result.status === 404) {
      res.status(404).json({ message: "Diary not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
