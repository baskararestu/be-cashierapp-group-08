const express = require('express')
const router = express.Router()
const { productController } = require('../controller')
const upload = require('../middleware/multer')

router.post(
  '/add-product',
  upload.single('image'),
  productController.addProductsCurrentUser
)
router.get('/', productController.getProduct)
router.get('/:id', productController.getProductById)
router.put('/edit/:id', upload.single('image'), productController.editProducts)
router.delete('/delete/:id', productController.deleteProductById)

module.exports = router
