import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { product_route } from './handlers/product'
import { user_route } from './handlers/user'
import { order_route } from './handlers/order'
import { UserDao } from './models/user'
import cors from 'cors'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(cors())
app.use(bodyParser.json())

product_route(app)
user_route(app);
order_route(app)

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(3000, async function () {
    console.log(`starting app on: ${address}`)
    const userDao = new UserDao()
    try {
        await userDao.createSuperAdminIfNotExist()
    } catch (error) {
        console.error(error)
    }
})


export default app