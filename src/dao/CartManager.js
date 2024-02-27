import {promises as fs} from 'fs'
import {nanoid} from 'nanoid'
import ProductManager from "./ProductManager.js";

import { cartModel } from './models/carts.model.js';
import ProductManagerMongo from './ProductManager.js';

const productAll = new ProductManager()

const productAllMongo = new ProductManagerMongo()

class CartManagerMongo {
    constructor() {
        this.path = "./src/models/carts.json"
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts))
    }

    exist = async (id) => {
        try{
            return await cartModel.findOne({id: id})
        } catch {
            return null   
        }
    }

    addCart = async () => {
        await cartModel.create({id: nanoid(), products: []})
        return "Carrito agregado"
    }

    addProductToCart = async (cid, pid) => {
        let cartById = await this.exist(cid)
        if (!cartById) return "El carrito no existe"

        let productById = await productAllMongo.exist(pid)

        if (!productById) return "El producto no existe"

        let productExist = cartById.products.find(data => {data.product == productById.id})

        if(productExist) {
            productExist.quantity++;
            await cartModel.updateOne(
                { id: cid, 'products.product': pid },
                { $set: { 'products.$.quantity': productExist.quantity } },
                { new: true }
            );
        } else {
            cartById.products.push({product: productById.id, quantity: 1})
            await cartById.save()
        }

        return "Producto agregado al carrito"

    }

    getCarts = async () => {
        return await this.readCarts()
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id)
        if (!cartById) return "El carrito no existe"
        return cartById.products
    }

    deleteCart = async (id) => {
        let cartById = await this.exist(id)
        if (!cartById) return "El carrito no existe"

        let oldCarts = await this.readCarts()
        let newCarts = oldCarts.filter(res => res.id != id)

        await this.writeCarts(newCarts)

        return "Carrito eliminado"
    }
}

export default CartManagerMongo