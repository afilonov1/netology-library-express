"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../db");
passport.use(new LocalStrategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(123);
    try {
        console.log(username, password);
        if (!username || !password)
            throw new Error("Missing Credentials");
        const userFromDb = db.find(user => user.username === username);
        if (!userFromDb)
            done(null, false);
        const isValid = userFromDb.password === password;
        if (!isValid) {
            console.log("Invalid Authentication");
            done(null, null);
        }
        console.log("Authenticated successfully");
        done(null, userFromDb);
    }
    catch (err) {
        console.log(err);
        done(err, null);
    }
})));
