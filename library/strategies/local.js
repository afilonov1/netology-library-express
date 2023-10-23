const passport = require("passport");
const LocalStrategy = require("passport-local");

const db = [{id: 1, username: "admin", password: "admin", displayName: "Anton", email: "testmail"}];

passport.use(
  new LocalStrategy(
    async(username, password, done) => {
      console.log(123)
      try {
        console.log(username,password)
        if (!username || !password) throw new Error("Missing Credentials");
  
        const userFromDb = db.find(user => user.username === username);
        if (!userFromDb) done(null, false);
        const isValid = userFromDb.password === password;
        if (!isValid) {
          console.log("Invalid Authentication");
          done(null, null);
        }
        console.log("Authenticated successfully");
        done(null, userFromDb);
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
)