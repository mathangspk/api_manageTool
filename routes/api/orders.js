const express = require('express');
const router = express.Router();
const { createOrderValidation } = require('../../validation')
const verify = require('../verifyToken');
// Order Model
const Order = require('../../models/Order');
const Tool = require('../../models/Tool');
const TOKEN_SECRET = require('../../config/secretToken').secretToken;
const jwt = require('jsonwebtoken');
const { concat } = require('joi');
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
    let token = req.headers['auth-token']
    console.log(jwt.verify(token, TOKEN_SECRET))
    let limit = Number(req.query.limit)
    let skip = Number(req.query.skip)
    let paramsQuery = {
        WO: { '$regex': req.query.wo || '' },
        PCT: { '$regex': req.query.pct || '' },
        status: { '$regex': req.query.status !== 'ALL' && req.query.status || '' },
        content: { '$regex': req.query.content || '' }
    }
    if (req.query.userId) {
        paramsQuery.userId = { '$in': req.query.userId.split(',') }
    }

    var countOrder = await Order.find(paramsQuery)
        .countDocuments({}, (err, count) => {
            return count;
        });
    await Order.find(paramsQuery)
        .skip(skip).limit(limit).populate("userId", "-password -__v -date")
        .sort({ date: -1 })
        .then(orders => res.status(200).json(
            {
                Data: { Row: orders, Total: countOrder },
                Status: { StatusCode: 200, Message: 'OK' }
            }
        ));
});
//@route Get api/order/collect-tools
//@desc Get all api/order/collect-tools
router.get('/collect-tools', verify, (req, res) => {
    let startDate = new Date(req.query.startDate)
    let endDate = new Date(req.query.endDate)
    queryParams = {
        timeStart: { $gte: startDate, $lte: endDate }
    }
    Order.find(queryParams)
        .populate("toolId")
        .populate("userId", "-password -__v -date")
        .sort({ date: -1 })
        .then(tools => res.status(200).json(
            {
                Data: { Row: tools, Total: tools.length },
                Status: { StatusCode: 200, Message: 'OK' }
            }
        ));
});
//@route POST api/orders
//@desc Create an orders
//@access Public
router.post('/', verify, async (req, res) => {
    //let validate the data before we a user
    //const { error } = createOrderValidation(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

    let date = new Date();
    let month = date.getMonth();
    let realMonth = month + 1;
    let year = String(date.getFullYear()).slice(2, 4);
    let realYear = Number(year);
    let pct = "14/11/20";
    let lastWo = await Order.findOne({}, {}, { sort: { 'date': -1 } }, function (err, order) {
        return order;
    });

    if (lastWo != null) {
        let pctLast = await lastWo.PCT.split("/")
        let numberPctLast = Number(pctLast[0]) + 1;
        let monthPCTLast = Number(pctLast[1]);
        let yearPCTLast = Number(pctLast[2]);
        let pct1;
        if (yearPCTLast != realYear) {
            if (monthPCTLast != realMonth) {
                pct1 = String(1).concat("/", String(month + 1), "/", String(realYear));
            } else {
                pct1 = String(numberPctLast).concat("/", String(month + 1), "/", String(realYear));
            }

            const newOrder = new Order({
                userId: req.body.userId,
                toolId: req.body.toolId,
                WO: req.body.WO,
                PCT: pct1,
                NV: req.body.NV,
                content: req.body.content,
                timeStart: req.body.timeStart,
                timeStop: req.body.timeStop,
                status: req.body.status,
            });
            newOrder.save()
                .then(order => res.json(order))
                .catch(err => res.json(err))
                ;
        }

        else {
            if (monthPCTLast != realMonth) {
                pct1 = String(1).concat("/", String(month + 1), "/", String(year));
            } else {
                pct1 = String(numberPctLast).concat("/", String(month + 1), "/", String(year));
            }

            const newOrder = new Order({
                userId: req.body.userId,
                toolId: req.body.toolId,
                WO: req.body.WO,
                PCT: pct1,
                NV: req.body.NV,
                content: req.body.content,
                timeStart: req.body.timeStart,
                timeStop: req.body.timeStop,
                status: req.body.status,
            });
            newOrder.save()
                .then(order => res.json(order))
                .catch(err => res.json(err))
                ;
        }
    } else {
        res.json("Create Work Order Fail");
    }
})

//@route DELETE api/orders:id
//@desc delete an orders
//@access Public
router.delete('/:id', verify, async (req, res) => {
    try {
        var toolId = [];
        await Order.findByIdAndDelete({ _id: req.params.id }).then(wo => {
            if (!wo) {
                return res.status(404).json({ error: "No Wo Found" });
            }
            else {
                toolId = wo.toolId;
                res.json(wo);
            }
        })
        console.log(toolId);
        toolId.forEach(_id => {
            Tool.findByIdAndUpdate(_id, { $set: { status: 1 } }).then(toolDeleted => {
                if (!toolDeleted) {
                    return res.status(404).json({ error: "No toolDelete Found" });
                } else {
                    ;
                    //res.status(200).json({ success: true });
                }
            }
            )
        })
    }
    catch (err) {
        res.status(404).json({ success: false })
    }
})

//update order
router.patch('/:orderId', verify, async (req, res) => {
    try {
        var toolId = [];
        const updateOrder = await Order.updateOne(
            { _id: req.params.orderId },
            {
                $set: {
                    userId: req.body.userId,
                    toolId: req.body.toolId,
                    WO: req.body.WO,
                    PCT: req.body.PCT,
                    NV: req.body.NV,
                    content: req.body.content,
                    timeStart: req.body.timeStart,
                    timeStop: req.body.timeStop,
                    status: req.body.status,
                }
            })

        const statusComplete = req.body.status;
        console.log(statusComplete);
        toolId = req.body.toolId;
        if (statusComplete == "COMPLETE") {
            toolId.forEach(tools => {
                console.log(tools._id)
                Tool.findByIdAndUpdate(tools._id, { $set: { status: 1 } }).then(toolDeleted => {
                    if (!toolDeleted) {
                        return res.status(404).json({ error: "No toolDelete Found" });
                    } else {
                        ;
                        //res.status(200).json({ success: true });
                    }
                })

            })
        };
        res.json(updateOrder);
        console.log(toolId);
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