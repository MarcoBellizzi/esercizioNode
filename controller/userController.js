const express = require('express')
const jwt = require('jsonwebtoken')
const { v1: uuidv1 } = require('uuid')

const mongoService = require('../service/mongoService')

const routes = express.Router()

routes.get('/', async (req, res) => {
    return res.status(200).send(await mongoService.getUsers())
})

routes.post("/add", async (req, res) => {
    if (!(req.body.email && req.body.password)) {
        return res.status(400).send('Provide email and password in the body')  // bad request
    }
    if (!req.body.email.match(/\S+@\S+\.\S+/)) {
        return res.status(400).send('Provide a right email')  // bad request
    }
    let user = await mongoService.getUser(req.body.email);
    if (user === null) {
        await mongoService.addUser({
            "_id": uuidv1(),
            "email": req.body.email,
            "password": req.body.password,
            "admin": false
        })
        return res.status(201).send("User registered")  // created
    } else {
        return res.status(400).send("The user is already registered")  // bad request
    }
})


routes.post("/login", async (req, res) => {
    if (!(req.body.email && req.body.password)) {
        return res.status(400).send('Required inputs are missing');  // bad request
    }
    let user = await mongoService.getUser(req.body.email);
    if (user === null) {
        return res.status(400).send("No user found")  // Bad Request
    }
    if (user.password !== req.body.password) {
        return res.status(401).send("Wrong password")  // unauthorized
    }
    if (user.admin === true) {
        const refreshToken = jwt.sign({
            email: user.email,
            password: user.password,
            admin: user.admin
        },
            "refreshSecret",
            { expiresIn: '1d' });

        // Assigning refresh token in http-only cookie 
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
    }
    return res.status(200).send({  // ok
        token: jwt.sign({
            email: user.email,
            password: user.password,
            admin: user.admin
        },
            "secret",
            { expiresIn: '1m' }
        )
    })
})

routes.post("/refresh", async (req, res) => {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        try {
            decoded = jwt.verify(refreshToken, "refreshSecret");
            if (decoded.admin === false) {
                return res.status(403).send("Only admins can refresh token")  // Forbidden
            } else {
                return res.status(200).send({  // ok
                    token: jwt.sign({
                        email: decoded.email,
                        password: decoded.password,
                        admin: decoded.admin
                    },
                        "secret",
                        { expiresIn: '1m' }
                    )
                })
            }
        } catch (err) {
            return res.status(401).send('Invalid Refresh Token');  // unauthorized
        }
    } else {
        // cookie not present
        return res.status(403).send("Cookie not present")  // Forbidden
    }
})

module.exports = routes;