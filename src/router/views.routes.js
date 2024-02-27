import { Router } from "express";

import ProductManagerMongo from "../dao/ProductManager.js"


const ViewsRouter = Router()
// const product = new ProductManager
const productMg = new ProductManagerMongo()



ViewsRouter.get("/", async (req,res) => {
    let limit = req.query.limit
    let page = req.query.page
    let query = req.query.query
    let sort = req.query.sort

    
    let allProducts = await productMg.getProducts(limit, page, query, sort)


    res.render("home", {
        title: "Product Manager",
        products: allProducts
    })
})

ViewsRouter.get("/realTimeProducts", async (req, res) => {
    let allProducts = await productMg.getProducts()
    res.render("realTimeProducts", {allProducts})
})

ViewsRouter.get("/chat", async (req, res) => {
    // let allProducts = await product.getProducts()
    res.render("chat", {})
})

export default ViewsRouter