const express = require('express')
const cookieparser = require('cookie-parser');

const userController = require('./controller/userController')
const fruitController = require('./controller/fruitController')
const saleController = require('./controller/saleController')

const authenticationService = require('./service/authenticationService')

const swaggerUi = require('swagger-ui-express')
swaggerDocument = require('./swagger.json')

const app = express()

app.use((req, res, next) => {
    console.log(`Logged ${req.url} ${req.method}`)
    next()
});

app.use(express.json())
app.use(cookieparser());

app.use('/api/v1/users', userController)
app.use('/api/v1/fruits', authenticationService, fruitController)
app.use('/api/v1/sales', authenticationService, saleController)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    res.status(404).send("Resource not found")
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})