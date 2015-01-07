var passport = require('passport');
var _  = require('lodash');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.find({
      where: {
        name: profile.displayName
      }
    })
      .then(function(user) {
        if (!user) {
          user = User.build({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            provider: 'facebook',
            facebook: _.merge(profile._json, { 
              refreshToken: refreshToken,
              accessToken:  accessToken
            })
          });
          user.save()
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              return done(err);
            });
        }
        else if(!user.dataValues.facebook) {
          user.dataValues.facebook = JSON.stringify(_.merge(profile._json, { 
            refreshToken: refreshToken,
            accessToken:  accessToken
          }));

          user.save({ hooks: false })
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              return done(err);
            });
        }
        else {
          return done(null, user);
        }
      })
      .catch(function(err) {
        return done(err);
      });
  }));
};
