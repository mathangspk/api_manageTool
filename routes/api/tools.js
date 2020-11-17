const express = require('express');
const router = express.Router();
const { toolValidation } = require('../../validation')
const verify = require('../verifyToken');
// Order Model
const Tool = require('../../models/Tool');

//@route GeT api/tools
//@desc Get all tools
//@access Public
router.get('/', verify, (req, res) => {
    Tool.find()
        .sort({ date: -1 })
        .then(tools => res.json(tools));
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
router.post('/', verify, (req, res) => {
    //let validate the data before we a user
    console.log(req.body)
    const { error } = toolValidation(req.body);
    console.log(error);
    if (error) return res.status(400).json(error.details[0].message);

    const newTool = new Tool({
        toolId: req.body.toolId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        type: req.body.type,
        quantity: req.body.quantity,
        images: req.body.images,
    });
    newTool.save()
        .then(tool => res.json(tool))
        .catch(err => 
            //console.log(err.message)
            res.status(400).json(err.errors.toolId.message) //gửi lỗi khi trùng toolID
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
router.patch('/:toolId', verify, async (req, res) => {
    try {
        const updateTool = await Tool.updateOne(
            { _id: req.params.toolId },
            {
                $set: {
                    toolId: req.body.toolId,
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