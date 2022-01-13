import request from 'supertest'
import app from '../../server'
import { UserDao, User } from '../../models/user'
import { Order, OrderDao, Cart } from '../../models/order'
import { Product, ProductDao } from '../../models/product'
import jwt, { JwtPayload } from 'jsonwebtoken'

const userDao = new UserDao()
const orderDao = new OrderDao()
const productDao = new ProductDao()

async function generateAccessToken(): Promise<string> {
    try {
        const userForm =  {first_name: generateRandomString(), last_name: generateRandomString(), username: generateRandomString(), password: 'Strong1password'}
        const user: User = await userDao.create(userForm)
        const token = jwt.sign({user_id: user.id, username: user.username} as JwtPayload, process.env.JWT_SECRET as jwt.Secret)
        return token
    } catch (error) {
        throw new Error((error as Error).message)
    }

}

// We need an existing user with an order and products assiociated with the order to be created
async function createUserAndOrder() {
    const username = generateRandomString()
    const userForm  = {first_name: 'Test', last_name: 'User', username, password: 'Strong1password'}
    try {
        const user = await userDao.create(userForm)
        const user_id = (user as User).id as number
        const product = await productDao.create({name: 'X', price: 10, category: 'Any'})
        const product_id = (product as Product).id as number
        const cart: Cart = {user_id: user_id, products:[{product_id, qty:2}]}
        const order = await orderDao.place(cart)
        return order as Order
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

function generateRandomString(){
    return Math.random().toString(16).substring(2,6)
}

describe('Order Api Test', ()=>{

    it('GET: /orders/current?user_id=x should return current order', async()=>{
        generateAccessToken().then(async(token)=>{
            // We need to create a user with an order
            const tempOrder = await createUserAndOrder()
            // Now we can get the current order by the user
            const currentOrderRes = await request(app)
            .get(`/orders/current?user_id=${tempOrder.user_id}`).set('Authorization', `Bearer ${token as string}`).send()
            const order : Order = currentOrderRes.body.order as Order
            expect(order.status).toEqual('active')

        })
    })

    it('GET: /orders/completed', async()=>{
        generateAccessToken().then(async(token)=>{
            // We need to create a user with an order
            const order = await createUserAndOrder()
            //Set the status to be completed
            await orderDao.setOrderCompleted(order.id as number)
            // Now we can get the current order by the user
            const completedORderRes = await request(app).get(`/orders/completed?user_id=${order.user_id}`)
            .set('Authorization', `Bearer ${token}`).send()
            const orders : Order[] = completedORderRes.body.orders as Order[]
            expect(orders[0].status).toEqual('completed')

        })
    })

   

})