import 'dotenv/config';
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import api from "./routes/api.js";
import userApi from "./routes/userApi.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "vite-project", "dist");
// I really like the way u did configuration for managing user sessions in an Express.js application. 
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, 
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
};

app.use(express.static(frontendPath));
app.use(express.json());
app.use(session(sessionConfig));

app.use("/api", api);
app.use("/userApi", userApi);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
