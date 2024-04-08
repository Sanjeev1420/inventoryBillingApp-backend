import express from 'express'
import TokenValidation from "../middlewares/validateToken.js"
import { commonUploadMiddleware }  from '../middlewares/uploadFile.js'
import BrandController from "../controllers/brand.js"
import ProductController from "../controllers/product.js"

const router = express.Router()

router.post('/addBrand' , TokenValidation, commonUploadMiddleware ,BrandController.addBrand)
router.get('/getAllBrands' , TokenValidation , BrandController.getAllBrand)
router.put('/updateBrand' , TokenValidation , BrandController.updateBrand)
router.delete('/deleteBrand' , TokenValidation ,BrandController.deleteBrand)
router.get('/getProductsByBrandId' , TokenValidation , ProductController.getProductsByBrandId)
router.post('/addProduct', TokenValidation , commonUploadMiddleware , ProductController.addProduct )
router.put('/updateProduct' , TokenValidation , ProductController.updateProduct)
router.delete('/deleteProduct' , TokenValidation ,ProductController.deleteProduct)
router.get('/getProductsForInvoice' , TokenValidation , ProductController.getProductsForInvoice)
router.get('/getLowStockProducts' , TokenValidation , ProductController.getLowStockProducts)

export default router

