import express from 'express'
import UserController from '../controllers/user.js'

const router = express.Router()

router.post('/signin' , UserController.signIn)
router.post('/login' , UserController.logIn)


export default router

