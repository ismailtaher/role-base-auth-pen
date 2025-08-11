const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const verifyPermissions = require('../../middleware/verifyPermissions');

router
  .route('/')
  .get(verifyPermissions(), productsController.getAllProducts)
  .post(verifyPermissions(), productsController.createNewProduct)
  .put(verifyPermissions(), productsController.updateProduct)
  .delete(verifyPermissions(), productsController.deleteProduct);

router.route('/:id').get(verifyPermissions(), productsController.getProduct);

module.exports = router;
