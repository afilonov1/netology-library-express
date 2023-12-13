const express = require("express");
const passport = require('passport');
// const LocalStrategy = require("passport-local");

require('../../strategies/local');

const db = require("../../db");

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})
  
passport.deserializeUser((id, cb) => {
    const user = db.find(user => user.id === id);
    if (user) return cb(null, user)
    return cb(Error("not found"))
})

const router = express.Router();

router.get("/login", (req, res) => {
    res.render('login');
});
router.get("/me", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('login')
      }
    res.render('profile', { user: req.user });
});

// app.use(passport.initialize())
// app.use(passport.session())


router.post(
    "/login",
    passport.authenticate('local', { failureRedirect: 'login', 
    // failureMessage: true
}),
    (req, res) => {
      console.log("req.user: ", req.user)
      res.redirect('me')
    }
);


router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('login');
    });
});
module.exports = router;