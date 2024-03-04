import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartSchema = mongoose.Schema({
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "products"},
          quantity: { type: Number, required: true },
        },
      ],
    },
  })

export const cartModel = mongoose.model(cartsCollection, cartSchema)