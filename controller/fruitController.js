const express = require('express');
const { v1: uuidv1 } = require('uuid')

const mongoService = require('../service/mongoService')

const routes = express.Router();

routes.get("/", async (req, res) => {
    return res.status(200).send(await mongoService.getFruits())  // ok
})

routes.post('/add', async (req, res) => {
    if (req.claims.admin === false) {
        return res.status(403).send("Only admins can add fruits")  // Forbidden
    } else {
        if (!(req.body.name && req.body.price)) {
            return res.status(400).send('Required inputs are missing')  // Bad Request
        }
        let fruit = await mongoService.getFruit(req.body.id)
        if (fruit === null) {
            await mongoService.addFruit({
                _id: uuidv1(),
                name: req.body.name,
                price: req.body.price
            })
            return res.status(201).send("Fruit added")  // Created
        } else {
            return res.status(400).send("Can't add the fruit, there is another fruit whit same id")  // Bad Request
        }
    }
})

routes.delete('/delete', async (req, res) => {
    if (req.claims.admin === false) {
        return res.status(403).send("Only admins can delete fruits")   // Forbidden
    } else {
        if (!req.body._id) {
            return res.status(400).send('Provide the id of the fruit in the body')  // Bad Request
        }
        let fruit = await mongoService.getFruit(req.body._id)
        if (fruit === null) {
            return res.status(400).send("Fuit not found")  // Bad Request
        } else {
            await mongoService.deleteFruit(req.body._id)
            return res.status(200).send("Fuit deleted")  // ok
        }
    }
})

routes.put('/update', async (req, res) => {
    if (req.claims.admin === false) {
        return res.status(403).send("Only admins can update fruits")  // Forbidden
    } else {
        if (!(req.body._id && req.body.name && req.body.price)) {
            return res.status(400).send('Required inputs are missing');   // Bad Request
        }
        let fruit = await mongoService.getFruit(req.body._id)
        if (fruit === null) {
            return res.status(400).send("Fuit not found")  // Bad Request
        } else {
            await mongoService.updateFruit({
                _id: req.body._id,
                name: req.body.name,
                price: req.body.price
            })
            return res.status(200).send("Fruit updated")  // ok
        }
    }
})

module.exports = routes;