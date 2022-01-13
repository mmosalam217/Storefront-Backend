import { Product, ProductDao, ProductFilter } from "../models/product";
import express, {Request, Response} from 'express'
import AuthFilter from "../middelwares/AuthFilter"

const productDao = new ProductDao();

async function loadProducts(req: Request, res: Response) {
    try {
        const products = await productDao.index();
        return res.status(200).json({status: 200, products: products})
    } catch (err) {
        return res.status(400).json({status: 400, message: 'Error fetching products'})
    }
}

async function createProduct(req: Request, res: Response){
    const productDto  = {
        name: req.body.name as string,
        price: req.body.price as number,
        category: req.body.category as string
    }
    // Validate inputs
    if(productDto.name.trim().length < 1) 
    return res.status(400).json({status: 400, message: "Enter a valid product name"});
    if(productDto.price <= 0) res.status(400).json({status: 400, message: "Price must not equal 0"});

    try {
        const product = await productDao.create(productDto);
        if(product) return res.status(200).json({status: 200, product})
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: 500, message: 'Technical error occured and couldn\'t create product. Please try again later'})
    }
}

async function findById(req: Request, res: Response) {
    const id = (req.params.id as unknown) as number;
    try {
        const product = await productDao.show(id);
        if(product) {
            return res.status(200).json({status: 200, product})
        }else{
            return res.status(404).json({status: 404, message: `Product with id ${id} couldn't be found`})
        } 
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: 500, message: `Technical error occured and couldn\'t fetch product. Please try again later`})
    }
}

async function filterBy(req: Request, res: Response) {
    const filter: ProductFilter = {
        id: (req.query.id as unknown) as number,
        name: req.query.name as string,
        category: req.query.category as string
    }
    try {
       const products = await productDao.filter(filter);
        return res.status(200).json({status: 200, products: products})
     }catch (err) {
         console.log(err);
        return res.status(500).json({status: 500, message: 'Error fetching products'})
    }

}

export const product_route = (app: express.Application) => {

    app.get("/products/index", loadProducts);
    app.get("/products", filterBy);
    app.get("/products/:id", findById);
    app.post("/products", AuthFilter, createProduct);
}

