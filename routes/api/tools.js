const express = require('express');
const router = express.Router();
const { toolValidation } = require('../../validation')
const verify = require('../verifyToken');
// Order Model
const Tool = require('../../models/Tool');

//@route GeT api/tools
//@desc Get all tools
router.get('/', verify, (req, res) => {
    Tool.find()
        .sort({ date: -1 })
        .then(tools => res.json(tools));
});
//@find name
router.get('/search', verify, (req, res) => {
    console.log(req.query)
    var name = req.query.name || '';
    var manufacturer = req.query.manufacturer || '';
    var type = req.query.type || '';
    var status = req.query.status || [1,2,3,4];
   
    Tool.find({
        name: { '$regex': name },
        manufacturer: { '$regex': manufacturer },
        type: { '$regex': type },
        status: { '$in': status }
    })
        .sort({ date: -1 })
        .then(tools => res.status(200).json(tools));
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
router.post('/', verify,  async (req, res) => {
    //let validate the data before we a user
    var reqStatus = req.body.status;
    console.log(req.body)
    function getStatus(reqStatus){
        return (reqStatus == "0" ? false:true)
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
        console.log(req.body)
        const updateTool = await Tool.updateOne(
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
            })
        res.json(updateTool);
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