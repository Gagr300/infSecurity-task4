const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config();

const { validationResult } = require('express-validator')

const ATCOOKIE = "Access-Token";
const RTCOOKIE = "Refresh-Token";

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Registration error', errors })
            }
            const { usr, pwd } = req.body
            const candidate = await User.findOne({ login: usr })
            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким логином уже существует" })
            }
            var salt = bcrypt.genSaltSync(5)
            var hash = bcrypt.hashSync(pwd, salt)
            const user = new User({ login: usr, password: hash, salt: salt })
            await user.save()
            return res.status(201).json({ message: "Пользователь был успешно зарегистрирован" })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }
    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Login error', errors })
            }
            const { usr, pwd } = req.body
            const user = await User.findOne({ login: usr })
            if (!user) {
                return res.status(400).json({ message: "Пользователя с таким логином не существует" })
            }
            const validPassword = bcrypt.compareSync(pwd, user.password)
            if (!validPassword) {
                return res.status(403).json({ message: "Неверный пароль" })
            }
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": user._id,
                        "login": user.login
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            )
            const refreshToken = jwt.sign(
                {
                    "login": user.login
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '12h' }
            )
            res.cookie('Access-Token', accessToken, {
                httpOnly : true
            })
            res.cookie('Refresh-Token', refreshToken, {
                //path: "/refresh",
                httpOnly : true
            })
            
            return res.status(200).json({message : "Welcome!"})

        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Login error' })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {

            console.log(e)
            res.status(400).json({ message: 'Get Users error' })
        }
    }

    async refresh(req, res) {
        try {
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Refresh error' })
        }
    }
}

module.exports = new authController()
