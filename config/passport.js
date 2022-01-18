let passport = require("passport");
let LocalStrategy = require("passport-local");
let User = require("../models/user");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            console.log("User not found");
            return done(null, false, "User not found"); }
        if (!user.verifyPassword(password)) { return done(null, false, "Password does not match"); }
        return done(null, user);
      });
    }
));