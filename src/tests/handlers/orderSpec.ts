import request from 'supertest'
import app from '../../server'
import { UserDao, User } from '../../models/user'
import { Order, OrderDao, Cart } from '../../models/order'
import { Product, ProductDao } from '../../models/product'

const userDao = new UserDao()
const orderDao = new OrderDao()
const productDao = new ProductDao()



// We need an existing user with an order and products assiociated with the order to be created
async function createUserAndOrder() {
    const username = generateRandomString()
    const userForm  = {first_name: 'Test', last_name: 'User', username, password: 'Strong1password'}
    try {
        const user = await userDao.create(userForm)
        const user_id = (user as User)?.id as number
        const product = await productDao.create({name: 'X', price: 10, category: 'Any'})
        const product_id = (product as Product)?.id as number
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
    const {SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD} = process.env

    it('GET: /orders/current?user_id=x should return current order', async()=>{
            // Authenticate admin to get the access_token back as the orders route is protected
            const auth_response = await request(app).post('/users/authenticate')
                                        .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
            const token = auth_response.body?.access_token
            // We need to create a user with an order
            const tempOrder = await createUserAndOrder()
            // Now we can get the current order by the user
            const currentOrderRes = await request(app)
            .get(`/orders/current?user_id=${tempOrder?.user_id}`).set('Authorization', `Bearer ${token as string}`).send()
            const order : Order = currentOrderRes.body?.order as Order
            expect(order?.status).toEqual('active')

    
    })

    it('GET: /orders/completed', async()=>{
             // Authenticate admin to get the access_token back as the orders route is protected
            const auth_response = await request(app).post('/users/authenticate')
                                        .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
            const token = auth_response.body?.access_token       
            // We need to create a user with an order
            const order = await createUserAndOrder()
            //Set the status to be completed
            await orderDao.setOrderCompleted(order?.id as number)
            // Now we can get the current order by the user
            const completedORderRes = await request(app).get(`/orders/completed?user_id=${order.user_id}`)
            .set('Authorization', `Bearer ${token as string}`).send()
            const orders : Order[] = completedORderRes.body?.orders as Order[]
            expect(orders[0]?.status).toEqual('completed')

    
    })

    it('POST: /orders/place => Create a new order', async()=>{
            // Authenticate admin to get the access_token back as the orders route is protected
            const auth_response = await request(app).post('/users/authenticate')
                                        .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
            const token = auth_response.body?.access_token 
            const user_id = auth_response.body?.user_id as number
            // Create a product to make sure we add products which exist in our database
            const product = await productDao.create({name: 'X', price: 10, category: 'Any'})
            const product_id = (product as Product)?.id as number
            // Place the order
            const cart: Cart = {user_id: user_id, products:[{product_id, qty:2}]}
            const order_res = await request(app).post('/orders/place')
                                .set('Authorization', `Bearer ${token as string}`)
                                .send(cart)
            const order = order_res.body?.order
            expect((order as Order)?.user_id).toEqual(user_id)
            expect((order as Order)?.order_items[0].product_id).toEqual(product_id)
    })
   

})