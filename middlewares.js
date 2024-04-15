import dotenv from "dotenv";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./models/schemas/contacts.js";


dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const strategyOptions = {
  secretOrKey: MONGODB_URI,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export default passport.use(
  new Strategy(strategyOptions, (payload, done) => {
    User.findOne({ _id: payload.id })
      .then((user) =>
        !user ? done(new Error("User not existing")) : done(null, user)
      )
      .catch(done);
  })
);

export const auth = (req, res, next) => {
  passport.authenticate("jwt", {session: false}, (error, user) => {
    if(!user || error) return res.status(401).json({message: "Not authorized"})
    req.user = user;
    next();
  })(req, res, next)
};