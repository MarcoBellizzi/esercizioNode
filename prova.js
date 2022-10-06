const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");

async function addAdmin() {
    try {
        await client.db('admin').collection('users').insertOne({
            "email": "marco@gmail.com",
            "password": "password",
            "admin": true
        });
    } finally {
        await client.close()
    }
}


async function get() {
    try {
        const cursor = await client.db('admin').collection('users').find({})
        await cursor.forEach(user => {
            console.log(user)
        })
    } finally {
        await client.close()
    }
}

//addAdmin()
get()