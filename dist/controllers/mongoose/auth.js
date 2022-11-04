"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogout = exports.postSignup = exports.postLogin = exports.getSignup = exports.getLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../../models/mongoose/user"));
const getLogin = (req, res) => {
    const error = req.flash('error');
    let message;
    if (error.length > 0) {
        [message] = error;
    }
    else {
        message = null;
    }
    res.render('mongoose/auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        linkIndex: 6,
    });
};
exports.getLogin = getLogin;
const getSignup = (req, res) => {
    const error = req.flash('error');
    let message;
    if (error.length > 0) {
        [message] = error;
    }
    else {
        message = null;
    }
    res.render('mongoose/auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
    });
};
exports.getSignup = getSignup;
const postLogin = (req, res) => {
    const { email, password } = req.body;
    user_1.default.findOne({ email })
        .then((user) => {
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        return bcryptjs_1.default.compare(password, user.password)
            .then((doMatch) => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(() => res.redirect('/'));
            }
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        })
            .catch(() => {
            res.redirect('/login');
        });
    })
        .catch(() => {
    });
};
exports.postLogin = postLogin;
const postSignup = (req, res) => {
    const { email, password } = req.body;
    user_1.default.findOne({ email })
        .then((userDoc) => {
        if (userDoc) {
            req.flash('error', 'E-Mail exists already, please pick a different one.');
            return res.redirect('/signup');
        }
        return bcryptjs_1.default
            .hash(password, 12)
            .then((hashedPassword) => {
            const user = new user_1.default({
                email,
                password: hashedPassword,
                cart: { items: [] },
            });
            return user.save();
        })
            .then(() => res.redirect('/login'));
    })
        .catch(() => {
    });
};
exports.postSignup = postSignup;
const postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
exports.postLogout = postLogout;
