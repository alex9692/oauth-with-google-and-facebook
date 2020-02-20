const passport = require("passport");
const GoogleStrategy = require("passport-google-token").Strategy;
const FacebookStrategy = require("passport-facebook-token");
const JWTStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { errorHandler } = require("./errorHandler");

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: function(req) {
        return req.cookies.jwt;
      },
      secretOrKey: process.env.JWT_SECRET
    },
    async function(payload, done) {
      try {
        const user = await User.findById(payload.id);
        // throw new Error("hi");
        if (!user) {
          return done(null, errorHandler("UnAuthorized", "fail", 403));
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(
          errorHandler(error.message),
          errorHandler("UnAuthorized", "fail", 403)
        );
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENTID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENTSECRET,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (req.cookies.jwt) {
          const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          req.user = user;
        }
        if (req.user) {
          console.log("1");
          const exitingUser = await User.findOne({ google: profile.id });
          if (exitingUser && exitingUser.id !== req.user.id) {
            return done(
              errorHandler(
                "There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.",
                "fail",
                400
              ),
              false
            );
          } else {
            console.log("2");
            const user = await User.findById(req.user.id);
            user.google = profile.id;
            user.username = user.username || profile.displayName;
            user.name = user.name || profile.name.givenName;
            user.avatar = user.avatar || profile._json.picture;

            await user.save();
            done(null, user);
          }
        } else {
          console.log("3");
          const user = await User.findOne({ google: profile.id });
          if (user) {
            console.log("4");
            return done(null, user);
          } else {
            console.log("5");
            const user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              console.log("6");
              user.google = profile.id;
              user.username = profile.displayName || user.username;
              user.name = profile.name.givenName || user.name;
              user.avatar = profile._json.picture || user.avatar;

              await user.save();
              return done(null, user);
            } else {
              console.log("7");
              const body = {
                username: profile.displayName,
                name: profile.name.givenName,
                google: profile.id,
                avatar: profile._json.picture,
                email: profile.emails[0].value
              };
              const user = await User.create(body);
              return done(null, user);
            }
          }
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (req.cookies.jwt) {
          const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          req.user = user;
        }

        if (req.user) {
          const exitingUser = User.findOne({ facebook: profile.id });
          if (exitingUser && exitingUser.id !== req.user.id) {
            return done(
              errorHandler(
                "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.",
                "fail",
                400
              ),
              false
            );
          } else {
            const user = User.findById(req.user.id);
            user.facebook = profile.id;
            user.username = user.username || profile.displayName;
            user.name = user.name || profile.name.givenName;
            user.avatar =
              user.avatar ||
              `https://graph.facebook.com/v2.6/${profile.id}/picture?type=large`;
            await user.save();
            done(null, user);
          }
        } else {
          const user = await User.findOne({ facebook: profile.id });
          if (user) {
            return done(null, user);
          } else {
            const user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.facebook = profile.id;
              user.username = profile.displayName || user.username;
              user.name = profile.name.givenName || user.name;
              user.avatar =
                `https://graph.facebook.com/v2.6/${profile.id}/picture?type=large` ||
                user.avatar;

              await user.save();
              return done(null, user);
            } else {
              const body = {
                username: profile.displayName,
                name: profile.name.givenName,
                facebook: profile.id,
                avatar: `https://graph.facebook.com/v2.6/${profile.id}/picture?type=large`,
                email: profile.emails[0].value
              };
              const user = await User.create(body);
              return done(null, user);
            }
          }
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

module.exports = passport;
