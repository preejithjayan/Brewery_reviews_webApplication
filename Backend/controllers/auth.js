const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User')

const makeToken = (data, options={}) => {
    return new Promise((res, rej) => {
        jwt.sign(data, process.env.JWT_SECRET, options, (error, token) => {
            if(error) rej(error)
            else res(token)
        })
    })
}

const parseToken = (token) => {
    return new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
            if(error) rej(error)
            else res(data)
        })
    })
}

exports.signup = async(req, res) => {
    const { email, password, name } = req.body;
    const existing = await UserModel.findOne({email});
    if(existing)
        return res.status(409).send("Email already exists")
    await UserModel.create({email, name, password: await bcrypt.hash(password, 10)})
    res.status(200).json({token: await makeToken({name, email}), profile: {name, email}})
}

exports.login = async(req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email})
    if(!user)
        return res.status(400).send("Email does not exist")
    if(!(await bcrypt.compare(password, user.password)))
        return res.status(400).send("Invalid Password")
    res.status(200).json({token: await makeToken({name: user.name, email}), profile: {name: user.name, email}})
}

exports.profile = (req, res) => {
    res.status(200).json(req.user)
}

exports.middleware = async(req, res, next) => {
    const headerVal = req.headers.authorization;
    if(!headerVal || !headerVal.startsWith('Bearer ')) {
        res.status(401).end("Unauthorized")
    } else {
        const token = headerVal.split(' ')[1]
        try {
            const data = await parseToken(token)
            const user = await UserModel.findOne({email: data.email})
            req.user = user;
            next();
        } catch (error) {
            res.status(401).send('Unauthorized')
        }
    }
}