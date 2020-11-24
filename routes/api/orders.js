const express = require('express');
const router = express.Router();
const { createOrderValidation } = require('../../validation')
const verify = require('../verifyToken');
// Order Model
const Order = require('../../models/Order');
const Tool = require('../../models/Tool');

//@route GeT api/orders
//@desc Get all orders
//@access Public
router.get('', verify, async (req, res) => {
    var countOrder = await Order.countDocuments({}, (err, count) => {
        return count;
    });
    let limit = Number(req.query.limit)
    let skip = Number(req.query.skip)

    console.log(countOrder);
    //console.log(countOrder)
    await Order.find().populate("userId", "-password -__v -date").skip(skip).limit(limit)
        .sort({ date: -1 })
        .then(orders => res.status(200).json(
            {
                Data: { Row: orders, Total: countOrder },
                Status: { StatusCode: 200, Message: 'OK' }
            }
        ))
        .catch(err => res.status(400).json(err));
});

//@skip -limit-orderby- order
// router.get('', verify, (req, res) => {
//     let limit = Number(req.query.limit)
//     let skip = Number(req.query.skip)
//     req.query.Orderby === 'desc' ? Order.find().limit(limit).skip(skip)
//         .sort({ date: 1 })
//         .then(orders => res.json(orders)) :
//         Order.find().limit(limit).skip(skip)
//             .sort({ date: -1 })
//             .then(orders => res.json(orders));
// });

//@route GeT api/orders
//@desc Get all orders
//@access Public
router.get('/search', verify, async (req, res) => {
    console.log(req.query)
    var wo = req.query.wo || '';
    var pct = req.query.pct || '';
    var status = req.query.status !== 'ALL' && req.query.status || '';
    let limit = Number(req.query.limit)
    let skip = Number(req.query.skip)

    var countOrder = await Order.find({
        WO: { '$regex': wo },
        PCT: { '$regex': pct },
        status: { '$regex': status }
    }).countDocuments({}, (err, count) => {
        return count;
    });
    console.log(countOrder)
    await Order.find({
        WO: { '$regex': wo },
        PCT: { '$regex': pct },
        status: { '$regex': status }
    }).skip(skip).limit(limit)
        .sort({ date: -1 })
        .then(orders => res.status(200).json(
            {
                Data: { Row: orders, Total: countOrder },
                Status: { StatusCode: 200, Message: 'OK' }
            }
        ));
});
//@route POST api/orders
//@desc Create an orders
//@access Public
router.post('/', verify, (req, res) => {
    //let validate the data before we a user
    //const { error } = createOrderValidation(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

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
        .then(order =>
            console.log(order).then(() => order.remove().then(() => res.json({ success: true }))))
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
    Order.findById(req.params.id).populate("toolId", "-toolId -__v").populate("userId", "-password -__v")
        .then(order => {
            res.json(order)
        })

})
router.get('/user/:id', verify, (req, res) => {
    Order.find().populate("userId")
        .then(order => {
            res.json(order)
        })

})



module.exports = router;