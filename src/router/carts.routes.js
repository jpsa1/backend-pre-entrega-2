import { Router } from "express";
import CartManager from "../controllers/CartManager.js";
import CartManagerMongo from "../dao/CartManager.js";

const CartRouter = Router()
const carts = new CartManager
const cartsMg = new CartManagerMongo

CartRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await cartsMg.getCartsById(id))

    //filesystem
    // res.send(await carts.getCartsById(id))
})

CartRouter.post("/", async (req, res) => {
    res.send(await cartsMg.addCart())
    
    //filesystem
    // res.send(await carts.addCart())

})

CartRouter.post("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    res.send(await cartsMg.addProductToCart(cid, pid))


    //filesystem
    // res.send(await carts.addProductToCart(cid, pid))
})

CartRouter.put("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let quantity = req.query.quantity
    res.send(await cartsMg.upDateQuantity(cid, pid, quantity))
})

// DELETE ALL PRODUCTS - Elimina todos los productos del carrito
CartRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await cartsMg.deleteAllProductsInCart(id))
})

// DELETE ONE PRODUCT - Elimina del carrito el producto seleccionado
CartRouter.delete("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    res.send(await cartsMg.DeleteOneProductInCart(cid, pid))
})

//PUT
// CartRouter.put("/:id", async (req, res) => {
//     let id = req.params.id
//     let cart = req.body
//     res.send(await carts.updateCart(id, cart))
// })

//DELETE - Elimina del carrito el producto seleccionado
// CartRouter.delete("/:id", async (req, res) => {
//     let id = req.params.id
//     res.send(await carts.deleteCart(id))
// })





export default CartRouter