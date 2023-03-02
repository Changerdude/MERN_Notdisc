const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.login = (req, res) => {
    const { email, pw } = req.body;
    if (!email || !pw) return res.status(400).json({ message: "Email and Password are required!" });
    User.findOne({ email: email })
        .then((user) => {
            const match = bcrypt.compareSync(pw, user.pwHash);
            if (match) {
                const accessToken = jwt.sign(
                    { "username": user.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10m' }
                );
                const refreshToken = jwt.sign(
                    { "username": user.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
                res.json({ accessToken, "username": user.username });
            } else {
                res.status(401);
            }
        })
        .catch((err) => {
            res.status(400).json({ message: "No account found", error: err });
        })
}

module.exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.sendStatus(204);
}

module.exports.refreshToken = (req, res) => {
    const { cookies } = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    User.findOne({ refreshToken })
        .then((user) => {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err || user.username !== decoded.username) return res.sendStatus(403);
                    const accessToken = jwt.sign(
                        { "username": decoded.username },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '10m' }
                    );
                    res.json({ accessToken })
                }
            )
        })
        .catch((err) => {
            res.sendStatus(403);
        })
}

module.exports.createUser = (req, res) => {
    const { email, username, pw } = req.body;
    const hashedPw = bcrypt.hashSync(pw, 10);
    const accessToken = jwt.sign(
        { "username": username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
        { "username": username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    const user = {
        email,
        username,
        "pwHash": hashedPw
    }
    User.create(user)
        .then((newUser) => {
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken, "username": newUser.username });
        })
        .catch((err) => {
            res.status(400).json({ message: "Username or Email already in use", error: err });
        });
}
module.exports.updateExistingUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then((updatedUser) => {
            res.json({ User: updatedUser });
        })
        .catch((err) => {
            res.status(400).json({ message: "Something went wrong", error: err });
        });
}

module.exports.deleteExistingUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then((result) => {
            res.json({ result: result });
        })
        .catch((err) => {
            res.json({ message: "Something went wrong", error: err });
        });
}