import { OrderDao, Cart, OrderProductDto } from "../models/order";
import express, {Request, Response } from 'express'
import AuthFilter from "../middelwares/AuthFilter";
import { AuthUserDetails } from "../models/user";


const orderDao = new OrderDao()


async function placeOrder(req: Request, res: Response) {
    const cart: Cart = {
        user_id: (req.body.authenticated as AuthUserDetails).id as number,
        products: req.body.products as OrderProductDto[]
    }

    if(cart.products.length < 1) return res.status(400).json({status: 400, message: 'Cart is empty, please add some purchases'})

    try {
        const order = await orderDao.place(cart)
        if(order) return res.status(200).json({status: 200, message: 'Order placed successfully', order})
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: 500, message: 'Error creating new order'})
    }
    
}


async function getUserCurrentOrder(req: Request, res: Response) {
    try {
        const order = await orderDao.getUserCurrentOrder((req.query.user_id as unknown) as number)
        if(order){
            return res.status(200).json({status: 200, order})
        }else{
            return res.status(404).json({status: 404, message: 'Currently no orders for user'})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: 500, message: 'Error fetching current order for user'})
    }
}

async function getUserCompletedOrders(req: Request, res: Response) {
    try {
        const orders = await orderDao.getCompletedOrders((req.query.user_id as unknown) as number)
        return res.status(200).json({status: 200, orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status: 500, message: 'Error fetching completed orders for user'})
    }
}

export const order_route = (app: express.Application) => {
    app.post('/orders/place', AuthFilter, placeOrder)
    app.get('/orders/current', AuthFilter, getUserCurrentOrder)
    app.get('/orders/completed', AuthFilter, getUserCompletedOrders)
}