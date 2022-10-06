const express = require('express')
const mongoService = require('../service/mongoService')

const routes = express.Router()

async function getSales(email) {
    let sales = []
    let s = await mongoService.getSales(email)
    s.forEach(sale => {
        let present = false
        let index = 0
        for (let i = 0; i < sales.length; i++) {
            if (sales[i].fruit_id === sale.fruit_id) {
                present = true
                index = i
            }
        }
        if (present) {
            sales[index].quantity += sale.quantity
        } else {
            sales.push({
                "fruit_id": sale.fruit_id,
                "fruit_name": sale.fruit_name,
                "quantity": sale.quantity
            })
        }
    })
    return sales
}

routes.get('/', async (req, res) => {
    return res.status(200).send(await getSales(req.claims.email))
})

routes.get('/history/:email', async (req, res) => {
    if (req.claims.admin === false) {
        return res.status(403).send("Only admins can use this API")  // Forbidden
    } else {
        return res.status(200).send(await getSales(req.params.email))  // ok
    }
})

routes.post('/add', async (req, res) => {
    const fruits = await mongoService.getFruits()
    let sales = []
    let bad = []
    req.body.fruits.forEach(element => {
        let present = false
        let name = ""
        fruits.forEach(fruit => {
            if (fruit._id == element.fruit) {
                present = true
                name = fruit.name
            }
        })
        if (present === true) {
            sales.push({
                "user": req.claims.email,
                "fruit_id": element.fruit,
                "fruit_name": name,
                "quantity": parseInt(element.quantity)
            })
        } else {
            bad.push(element.fruit)
        }
    })
    if (bad.length > 0) {
        return res.status(400).send("Cannot find fruits " + bad)  // Bad Request
    } else {
        mongoService.addSales(sales)
        return res.status(201).send("Fruits added in your sales")  // Created
    }
})

module.exports = routes;