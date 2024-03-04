import {productModel} from './models/products.model.js'
import {nanoid} from 'nanoid'


class ProductManagerMongo {

    readProducts = async () => {
        try{
            return await productModel.find()  
        }catch(error) {
            console.log("No se pudo leer la base de Mongo: " + error)
            return "Error al tratar de obtener los productos"
        }
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    exist = async (id) => {
        try{
            return await productModel.findById(id)
        } catch {
            return null   
        }
        // return await productModel.findOne({_id:id}).lean()
    }

    addProducts = async (product) => {
        
        //Controla que todos los valores contengan datos. 
        if(!(product.title && product.description && product.price && product.thumbail && product.code && product.stock)) 
        {return "ERROR: Todos los campos son requeridos"}

        //Controlar que el producto no este repetido
        
            let productoExiste = await productModel.findOne({code: product.code})
            
            if(productoExiste) return 'ERROR: Producto repetido'
            
            product.id = nanoid()
      
            await productModel.create(product)
            return "Producto Agregado exitosamente"
    }

    getProducts = async (limit, page, query, sort) => {
        
        if(!limit) limit=10
        if(!page) page=1
        if(!query) query=""
        if(!sort) sort={ price: -1 }

        let regExpresion = new RegExp(query, 'i')

        let products = await productModel.paginate({title: { $regex: regExpresion }}, {limit:limit, page:page, sort:sort, lean: true})

        let objetoProducts = {
                status:"success/error",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage
        }

        objetoProducts.prevLink = products.hasPrevPage?`http://localhost:8080/?page=${products.prevPage}&limit=${limit}&sort=${sort.price}&query=${query}`:''
        objetoProducts.nextLink = products.hasNextPage?`http://localhost:8080/?page=${products.nextPage}&limit=${limit}&sort=${sort.price}&query=${query}`:''

        return objetoProducts

    }

    getProductsById = async (id) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto no encontrado"
        return productById
    }

    updateProducts = async (id, product) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto no encontrado"

        // await productModel.updateOne({id:id}, product)

        await productModel.findByIdAndUpdate(id, product)

        return "Producto actualizado exitosamente" 
    }

    deleteProducts = async (id) => {
        
        let existeProducts = await this.exist(id)

        console.log('existeProducts: '+existeProducts)

        if (existeProducts) {
            await productModel.findByIdAndDelete(id)
            return "Producto eliminado"
        }else{
            return 'Producto no existe'
        }
    }
}

export default ProductManagerMongo



