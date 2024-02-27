import mongoose from "mongoose";

const cartsCollection = 'carts'

const productSchema = new mongoose.Schema({
    product: String,
    quantity: Number
})

const cartShema = new mongoose.Schema({
    id: String,
    products: [productSchema]
})

export const cartModel = mongoose.model(cartsCollection, cartShema)