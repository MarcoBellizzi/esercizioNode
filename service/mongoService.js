const { MongoClient } = require("mongodb")

// const client = new MongoClient("mongodb://localhost:27017")
const client = new MongoClient("mongodb://mongodb:27017")

async function getUsers() {
    let users = []
    const cursor = await client.db('admin').collection('users').find({})
    await cursor.forEach(user => {
        users.push(user)
    })
    return users
}

async function getUser(email) {
    return await client.db('admin').collection('users').findOne({ email: email });
}

async function addUser(user) {
    await client.db('admin').collection('users').insertOne(user)
}

async function getFruits() {
    let fruits = []
    const cursor = await client.db('admin').collection('fruits').find({})
    await cursor.forEach(fruit => {
        fruits.push(fruit)
    })
    return fruits
}

async function getFruit(id) {
    return await client.db('admin').collection('fruits').findOne({_id:id});
}

async function addFruit(fruit) {
    await client.db('admin').collection('fruits').insertOne(fruit)
}

async function deleteFruit(id) {
    await client.db('admin').collection('fruits').deleteOne({_id:id})
}

async function updateFruit(fruit) {
    await client.db('admin').collection('fruits').updateOne(
        { _id: fruit._id },
        { $set: { 
            name: fruit.name,
            price: fruit.price
        }}
    )
}

async function getSales(user) {
    let sales = []
    const cursor = await client.db('admin').collection('sales').find({user: user})
    await cursor.forEach(sale => {
        sales.push(sale)
    })
    return sales
}

async function addSales(sales) {
    await client.db('admin').collection('sales').insertMany(sales)
}

module.exports = {
    getUsers, getUser, addUser, getFruits, getFruit, addFruit,
    deleteFruit, updateFruit, getSales, addSales
}