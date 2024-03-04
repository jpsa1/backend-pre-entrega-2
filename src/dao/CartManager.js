import {promises as fs} from 'fs'
import {nanoid} from 'nanoid'
import ProductManager from "./ProductManager.js";

import { cartModel } from './models/carts.model.js';
import ProductManagerMongo from './ProductManager.js';
import { Console } from 'console';

const productAll = new ProductManager()

const productAllMongo = new ProductManagerMongo()

class CartManagerMongo {
    constructor() {
        this.path = "./src/models/carts.json"
    }

    //DAO
    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts))
    }

    exist = async (id) => {
        try{
            return await cartModel.findById(id)
        } catch {
            return null   
        }
    }

    cartUpDate = async (id, cart) => {
        await cartModel.findByIdAndUpdate(id, cart)
        return "Carrito actualizado"
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

        // let productExist = cartById.products.find(data => data.equals(productById._id))
        
        console.log('pid')
        
        let productExist = cartById.products.find(data => {
            return data.product == pid 
        })

        console.log('productExist: '+productExist)

        if(productExist) {
            productExist.quantity++;
            await cartModel.updateOne(
                { _id: cid, 'products.product': pid },
                { $set: { 'products.$.quantity': productExist.quantity } },
                { new: true }
            );
        } else {
            cartById.products.push({product: productById._id, quantity: 1})
            await cartById.save()
        }

        return "Producto agregado al carrito"
    }

    getCarts = async () => {
        return await this.readCarts()
    }

    getCartsById = async (id) => {
        
        // let cartById = await this.exist(id)
        let cartById = await cartModel.findById(id).populate('products.product')

        
        console.log('cartById.products: '+cartById)
        
        if (!cartById) return "El carrito no existe"
        return cartById.products

    }

    //Actualiza TODOS los productos dentro del carrito
    updateAllProductsInCart = async (id, products) => {
        let cartById = await this.exist(id)
        if (!cartById) return "El carrito no existe"

        cartById.products = products

        let result = cartModel.findByIdAndUpdate(id, cartById)
        // let result = this.cartUpDate(cartById.id, cartById)

        return result
    }

    //SOLO se actualiza la cantidad del producto
    upDateQuantity = async (cid, pid, quantity) => {
        let cartById = await this.exist(cid)
        if (!cartById) return "El carrito no existe"

        let productById = await productAllMongo.exist(pid)
        if (!productById) return "El producto no existe"

        let productExist = cartById.products.find(data => data.product == pid)
        console.log('productExist: '+productExist)

        if(!productExist) return "El producto no esta en el carrito"

        productExist.quantity = quantity

        let newProducts = cartById.products.filter(data => data.product != pid)
        newProducts.push(productExist)

        cartById.products = newProducts

        let result = this.cartUpDate(cid, cartById)
        
        return "Cantidad actualizada del producto en el carrito"
    }

    deleteAllProductsInCart = async (id) => {
        let cartById = await this.exist(id)
        if (!cartById) return "El carrito no existe"

        cartById.products = []

        let result = this.cartUpDate(id, cartById)

        return result
    }

    DeleteOneProductInCart = async (cid, pid) => {
        let cartById = await this.exist(cid)
        if (!cartById) return "El carrito no existe"

        let productById = await productAllMongo.exist(pid)
        if (!productById) return "El producto no existe"

        let upDateProducts = cartById.products.filter(data => data.product != pid)

        cartById.products = upDateProducts

        let result = this.cartUpDate(cid, cartById)

        return result

    }
}

export default CartManagerMongo