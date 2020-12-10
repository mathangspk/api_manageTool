const express = require('express');
const router = express.Router();
const { toolValidation } = require('../../validation')
const verify = require('../verifyToken');
const TOKEN_SECRET = require('../../config/secretToken').secretToken;
const jwt = require('jsonwebtoken');
// Order Model
const Tool = require('../../models/Tool');

//@route GeT api/tools
//@desc Get all tools
router.get('/', verify, (req, res) => {
    Tool.aggregate([
        {
            $lookup: {
                from: "orders",
                let: { id: "$_id" },
                pipeline: [
                    { $match: { $expr: { $in: ["$$id", "$toolId"] } } },
                    {
                        $lookup: {
                            from: "users",
                            let: { id: "$userId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$$id", "$_id"] } } },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1
                                    }
                                }
                            ],
                            as: "userInfo"
                        }
                    },
                    { $unwind: "$userInfo" }
                ],
                as: "woInfo"
            }
        }
    ]).sort({ date: -1 }).then(tools => res.json(tools));
});
//@find name
router.get('/search', verify, async (req, res) => {
    let aggregate = [
        { $match: { name: { $regex: req.query.name || '' } } },
        { $match: { manufacturer: { $regex: req.query.manufacturer || '' } } },
        { $match: { type: { $regex: req.query.type || '' } } }
    ]
    if (req.query.status && req.query.status !== 'all') {
        aggregate.push({ $match: { status: { $eq: parseInt(req.query.status) } } })
    }
    aggregate.push({
        $lookup: {
            from: "orders",
            let: { id: "$_id" },
            pipeline: [
                { $match: { $expr: { $in: ["$$id", "$toolId"] } } },
                {
                    $lookup: {
                        from: "users",
                        let: { id: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$$id", "$_id"] } } },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1
                                }
                            }
                        ],
                        as: "userInfo"
                    }
                },
                { $unwind: "$userInfo" }
            ],
            as: "woInfo"
        }
    })
    await Tool.aggregate(aggregate).sort({ date: -1 }).then(tools => res.json(tools));
});
//@skip limit tool
router.get('/skip', verify, (req, res) => {
    let count = Number(req.query.count)
    Tool.find().limit(count).skip(1)
        .sort({ date: -1 })
        .then(tools => res.json(tools));
});
//@route POST api/tools
//@desc Create an tools
//@access Public
router.post('/', verify, async (req, res) => {
    //let validate the data before we a user
    var reqStatus = req.body.status;
    console.log(req.body)
    function getStatus(reqStatus) {
        return (reqStatus == "0" ? false : true)
    }
    console.log(getStatus(reqStatus))
    // const { error } = toolValidation(req.body);
    //console.log(error);
    //if (error) return res.status(400).json(error.details[0].message);

    const newTool = new Tool({
        status: Boolean(getStatus(reqStatus)),
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        type: req.body.type,
        quantity: req.body.quantity,
        images: req.body.images,
    });
    await newTool.save()
        .then(tool => res.json(tool))
        .catch(err =>
            //console.log(err.message)
            //res.status(400).json(err.errors.toolId.message) //gửi lỗi khi trùng toolID
            res.status(400).json(err) //gửi lỗi khi trùng toolID
        )
        ;
})

//@route DELETE api/orders:id
//@desc delete an orders
//@access Public
router.delete('/:id', verify, (req, res) => {
    Tool.findById(req.params.id)
        .then(tool => tool.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }))
})

//update tool
router.patch('/:id', verify, async (req, res) => {
    try {
        let token = await req.headers['auth-token']
        let tokenUser = await jwt.verify(token, TOKEN_SECRET); //get current user from token
        let currentUser = tokenUser._id;
        let adminUser = tokenUser.admin;
        let tool = await Tool.findById(req.params.id)
        //when user add tool
        if (tool.status === 1) { //check status tool is READY
            console.log("tool READY")
            await Tool.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        status: parseInt(req.body.status),
                        name: req.body.name,
                        manufacturer: req.body.manufacturer,
                        type: req.body.type,
                        quantity: req.body.quantity,
                        currentUser: currentUser,
                        images: req.body.images,
                    }
                }).then(tool => res.status(200).json(
                    {
                        Data: { Row: tool },
                        Status: { StatusCode: 200, Message: 'OK' }
                    }));
     

        }
        if (tool.status === 2 && tool.currentUser === currentUser) {
            console.log("it me remove tool from list")

            await Tool.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        status: parseInt(req.body.status),
                        name: req.body.name,
                        manufacturer: req.body.manufacturer,
                        type: req.body.type,
                        quantity: req.body.quantity,
                        images: req.body.images,
                    }
                }).then(tool => res.status(200).json(
                    {
                        Data: { Row: tool },
                        Status: { StatusCode: 200, Message: 'OK' }
                    }));
        }
        if ( ((tool.status === 3 || tool.status === 4) && adminUser === true)) {
            console.log("the tool after to fix")

            await Tool.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        status: parseInt(req.body.status),
                        name: req.body.name,
                        manufacturer: req.body.manufacturer,
                        type: req.body.type,
                        quantity: req.body.quantity,
                        images: req.body.images,
                    }
                }).then(tool => res.status(200).json(
                    {
                        Data: { Row: tool },
                        Status: { StatusCode: 200, Message: 'OK' }
                    }));
        }
        else {
            res.status(500).json({ message: "Tool đã được sử dụng" })
        }

    } catch (err) {
        res.json({ message: err });
    }
})
//get one tool by id
router.get('/:id', verify, (req, res) => {
    Tool.findById(req.params.id)
        .then(tool => {
            res.json(tool)
        })
})

module.exports = router;