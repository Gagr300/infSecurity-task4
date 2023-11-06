const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')

router.post('/registrate',[
    check('usr', "Логин пользователя не может быть пустым и содержать только буквы и цифры").notEmpty().isAlphanumeric(),
    check('pwd', "Пароль пользователя не может быть короче 4 сиволов и длинее 20").isLength({min:4,max:20})
], controller.registration)
router.post('/login',[
    check('usr', "Логин пользователя не может быть пустым и содержать только буквы и цифры").notEmpty().isAlphanumeric(),
    check('pwd', "Пароль пользователя не может быть короче 4 сиволов и длинее 20").isLength({min:4,max:20})
], controller.login)
router.get('/users', controller.getUsers)
router.post('/refresh', controller.refresh)
router.get('/', (req, res) => {
    res.json({msg: 'Hello world!!!'});
});

module.exports = router