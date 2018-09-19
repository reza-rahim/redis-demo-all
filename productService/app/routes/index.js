var express = require('express');
var router = express.Router();
var Order = require('../models/orders');
var Product = require('../models/product');


router.get('/getProducts', async (req, res, next) => {
        //console.log(req)
        products = await Product.getProducts()
        //console.log(products)
        res.status(200).json(products)
})

router.get('/getProduct/:productId', async (req, res, next) => {
        //console.log(req)
        let productId= req.params.productId
        product = await Product.getProduct(productId)
        //console.log(products)
        res.status(200).json(product)
})


module.exports = router;


