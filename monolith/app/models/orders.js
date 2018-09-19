var Redis = require('../models/redis');
var HashMap = require('hashmap');

async function createOrders(orderPayLoad) {

    let redisClient = Redis.redisClient
    var mul =redisClient.multi()

    mul.hmset("order:{"+orderPayLoad.user+'}:'+orderPayLoad.orderNumber,
              "user",orderPayLoad.user,
              "orderNumber", orderPayLoad.orderNumber,
              "name", orderPayLoad.name, 
              "address", orderPayLoad.address,
              "totalQty", orderPayLoad.totalQty , 
              "totalPrice", orderPayLoad.totalPrice )

    mul.sadd("all-orders:"+orderPayLoad.user,"{"+orderPayLoad.user+"}:"+orderPayLoad.orderNumber)

    //console.log(orderPayLoad)
    orderPayLoad.lineItems.forEach(function(lineItem){
        mul.hmset("lineItem:{"+orderPayLoad.user+'}:'+orderPayLoad.orderNumber+":"+lineItem.id,
                  "user",orderPayLoad.user,
                  "orderNumber", orderPayLoad.orderNumber, 
                  "line", lineItem.id,
                  "id", lineItem.id,
                  "title", lineItem.title,
                  "qty",lineItem.qty, 
                  "price", lineItem.price )
        mul.sadd("all-lineItems:"+orderPayLoad.user+":"+orderPayLoad.orderNumber, "{"+orderPayLoad.user+"}:"+
                    orderPayLoad.orderNumber+":"+lineItem.id )
    })

    let reply = await mul.execAsync(); 
    return reply;

}

async function getLineItemsDetails(lineItemsKeys) {
     let redisClient = Redis.redisClient

}


async function getOrders(user) {
  let redisClient = Redis.redisClient


  let orderView = []

  let ordersRedis = await redisClient.smembersAsync('all-orders:'+user);

  //console.log('ordersRedis', ordersRedis.toString());

  let batOrder = redisClient.batch();

  ordersRedis.forEach(function(order) {
     batOrder.hgetall('order:'+order)
  })

  let allorders = await batOrder.execAsync()

  for (let i = 0; i < allorders.length; i++) {

    tmpOrder = allorders[i]

    let lineItemsKeys = await redisClient.smembersAsync('all-lineItems:'+allorders[i].user+':'+allorders[i].orderNumber);

    //console.log(lineItemsKeys)

    let batLineItems = redisClient.batch();

    for (let j = 0; j < lineItemsKeys.length; j++) {
       batLineItems.hgetall('lineItem:'+lineItemsKeys[j])
    }

    let items = await batLineItems.execAsync()
    //console.log(items)
    
    tmpOrder.lineItems = items
    orderView.push(tmpOrder)
  }
  
  //console.log(allorders)
  return orderView
}

module.exports.getOrders =  getOrders
module.exports.createOrders =  createOrders
