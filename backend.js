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

const strategy = new LocalStrategy(async function verify(
  username,
  password,
  cb
) {
  try {
    console.log("verify", username, password);

    const user = await userDB.getUser(username);

    if (!user) {
      return cb(null, false, { message: "Incorrect username or password." });
    }

    crypto.pbkdf2(
      password,
      user.salt,
      1000,
      64,
      "sha512",
      function (err, hashedPassword) {
        if (err) {
          return cb(err);
        }
        if (hashedPassword.toString("hex") !== user.hashed_password) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return cb(null, user);
      }
    );
  } catch (err) {
    console.log("error in verify", err);
    return cb(err);
  }
});
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDB.getUserById(id);

    if (!user) {
      return done(new Error("User not found"));
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

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

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", api);
app.use("/userApi", userApi);

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
