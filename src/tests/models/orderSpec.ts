import { OrderDao, Order, OrderProductDto, Cart } from "../../models/order";
import { UserDao, User } from "../../models/user";
import { ProductDao, Product } from "../../models/product";

const orderDao = new OrderDao()
const userDao = new UserDao()
const productDao = new ProductDao()

function generateRandomString(){
    return Math.random().toString(16).substring(2,6)
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

describe('Order Model Specs', async ()=>{



    it('should return current order of user', async()=>{
                createUserAndOrder().then(async(order : Order)=>{
                const current = await orderDao.getUserCurrentOrder(order.user_id)
                expect((current as Order).user_id as number).toEqual(order.user_id)
            })


    })

    it('should return a list of completed orders', async()=>{
            createUserAndOrder().then(async(order: Order)=>{
                // We need to set the created order to completed as the orders are created with an active status by default
                await orderDao.setOrderCompleted(order.id)
                const orders = await orderDao.getCompletedOrders(order.user_id)
                console.log(orders)
                expect(orders.length).toEqual(1)
            })

    })
})