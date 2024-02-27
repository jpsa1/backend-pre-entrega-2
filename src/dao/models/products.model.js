import mongoose from "mongoose";
import moogoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productShema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbail: String,
    code: String,
    stock: Number,
    id: String
})

productShema.plugin(moogoosePaginate)

export const productModel = mongoose.model(productsCollection, productShema)