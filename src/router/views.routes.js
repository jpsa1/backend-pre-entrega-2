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

    res.send(await productMg.getProducts(limit, page, query, sort))

})

ViewsRouter.get("/products", async (req,res) => {
    let limit = req.query.limit
    let page = req.query.page
    let query = req.query.query
    let sort = req.query.sort

    let allProducts = await productMg.getProducts(limit, page, query, sort)

    console.log('allProducts: '+allProducts)

    res.render("products", {
        title: "Product Manager",
        products: allProducts
    })
})

ViewsRouter.get("/products/:id", async (req,res) => {
    let id = req.params.id
    
    console.log('id: '+ id)

    let product = await productMg.getProductsById(id)
    
    product = product.toObject()

    console.log("product: "+product)

    res.render("detailProduct", {
        title: `Producto - ${product.title}`,
        products: product
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