const express = require('express');
const router = express.Router();
const { createOrderValidation } = require('../../validation')
const verify = require('../verifyToken');
// Order Model
const Order = require('../../models/Order');

//@route GeT api/orders
//@desc Get all orders
//@access Public
router.get('/no', verify, (req, res) => {
    Order.find()
        .sort({ date: -1 })
        .then(orders => res.json(orders));
});
//@route GeT api/orders
//@desc Get all orders
//@access Public
router.get('/search', verify, (req, res) => {
    Order.find({status:req.query.status})
        .sort({ date: 1 })
        .then(orders => res.json(orders));
});
//@route POST api/orders
//@desc Create an orders
//@access Public
router.post('/', verify, (req, res) => {
    //let validate the data before we a user
    const { error } = createOrderValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newOrder = new Order({
        userId: req.body.userId,
        toolId: req.body.toolId,
        WO: req.body.WO,
        PCT: req.body.PCT,
        timeStart: req.body.timeStart,
        timeStop: req.body.timeStop,
        status: req.body.status,
    });
    newOrder.save()
        .then(order => res.json(order))
        .catch(err => res.json(err))
        ;
})

//@route DELETE api/orders:id
//@desc delete an orders
//@access Public
router.delete('/:id', verify, (req, res) => {
    Order.findById(req.params.id)
        .then(order => order.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }))
})

//update order
router.patch('/:orderId', verify, async (req, res) => {
    try {
        const updateOrder = await Order.updateOne(
            { _id: req.params.orderId },
            {
                $set: {
                    userId: req.body.userId,
                    toolId: req.body.toolId,
                    WO: req.body.WO,
                    timeStart: req.body.timeStart,
                    timeStop: req.body.timeStop,
                    status: req.body.status,
                }
            })
        res.json(updateOrder);
    } catch (err) {
        res.json({ message: err });
    }
})
//@route get order by id
router.get('/:id', verify, (req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            res.json(order)
        })
})


module.exports = router;