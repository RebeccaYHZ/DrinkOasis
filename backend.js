import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import api from "./routes/api.js";
import userApi from "./routes/userApi.js";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { userDB } from "./modules/userDB.js";

userDB.getUser = () => {
  return {
    username: "test",
    salt: Buffer.from("test"),
    hashed_password: Buffer.from("test"),
  };
};

const strategy = new LocalStrategy(function verify(username, password, cb) {
  try {
    console.log("verify", username, password);

    const user = userDB.getUser(username);

    if (!user) {
      cb(null, false, { message: "Incorrect username or password." });
      return false;
    }

    crypto.pbkdf2(
      password,
      user.salt,
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        if (err) {
          return cb(err);
        }
        // if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        //   return cb(null, false, {
        //     message: "Incorrect username or password.",
        //   });
        // }
        return cb(null, user);
      }
    );

    cb(null, user);
  } catch (err) {
    console.log("error in verify", err);
    cb(err);
  }
});
passport.use(strategy);

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "vite-project", "dist");

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};

app.use(express.static(frontendPath));
app.use(express.json());
app.use(session(sessionConfig));

app.use("/api", api);
app.use("/userApi", userApi);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
