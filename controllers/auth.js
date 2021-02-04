const bycryt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                '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'
        }
    })
);
const getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
        },
        validationErrors: []
    });
};


const postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'invalid E-Mail or password.');
                return res.redirect('/login');
            }
            bycryt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'invalid E-Mail or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    res.redirect('/login');
                    console.log("err signup", err)
                });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

const postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

const getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

const postSignup = (req, res, next) => {
    const errors = validationResult(req);
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }

    bycryt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'daf98779@zwoho.com',
                subject: 'signup success',
                html: '<h1>done signup</h1>'
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

const getResetPassword = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'reset',
        errorMessage: message
    });
}

const postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log("err creating token", err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset-password');
                }
                user.resetToken = token;
                user.resetTokenExpiry = Date.now() + 36000000;
                return user.save()
                    .then(result => {
                        res.redirect('/');
                        return transporter.sendMail({
                            to: req.body.email,
                            subject: 'Password reset',
                            from: 'daf98779@zwoho.com',
                            html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
          `
                        });
                    })
            })
            .catch(err => {
                console.log("err sending reset mail", err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    })

}

const getNewPassword = (req, res, next) => {
    const token = req.params.token;
    console.log(token);
    User.findOne({resetToken: token, resetTokenExpiry: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                req.flash('error', 'user not found');
                return res.redirect('/reset-password');
            }
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

const postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiry: {$gt: Date.now()},
        _id: userId
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'cannot reset password, user not valid');
                return res.redirect('/login');
            }
            resetUser = user;
            return bycryt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiry = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}


module.exports = {
    getLogin: getLogin,
    postLogin: postLogin,
    postLogout: postLogout,
    getSignup: getSignup,
    postSignup: postSignup,
    getResetPassword: getResetPassword,
    postResetPassword: postResetPassword,
    getNewPassword: getNewPassword,
    postNewPassword: postNewPassword
}