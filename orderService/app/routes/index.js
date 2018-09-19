var express = require('express');
var router = express.Router();
var Order = require('../models/orders');
var Product = require('../models/product');


router.post('/createOrders', async (req, res, next) => {
      //console.log(req.body)
      let reply = await Order.createOrders(req.body)
      res.status(200).json(reply)
});

router.get('/getOrders/:user', async (req, res, next) => {


        let user= req.params.user

        let orders = await Order.getOrders(user)
        //console.log(orders)
        res.status(200).json(orders)
});


module.exports = router;


