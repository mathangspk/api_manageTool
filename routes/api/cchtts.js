const express = require('express');
const router = express.Router();
const { createCchttValidation } = require('../../validation')
const verify = require('../verifyToken');
// Cchtt Model
const Cchtt = require('../../models/Cchtt');
const Tool = require('../../models/Tool');
const TOKEN_SECRET = require('../../config/secretToken').secretToken;
const jwt = require('jsonwebtoken');
const { concat } = require('joi');
//@route GeT api/cchtts
//@desc Get all cchtts
//@access Public
router.get('', verify, async (req, res) => {
    var countCchtt = await Cchtt.countDocuments({}, (err, count) => {
        return count;
    });
    let limit = Number(req.query.limit)
    let skip = Number(req.query.skip)

    //console.log(countCchtt);
    //console.log(countCchtt)
    await Cchtt.find().populate("userId", "-password -__v -date").skip(skip).limit(limit)
        .sort({ date: -1 })
        .then(cchtts => res.status(200).json(
            {
                Data: { Row: cchtts, Total: countCchtt },
                Status: { StatusCode: 200, Message: 'OK' }
            }
        ))
        .catch(err => res.status(400).json(err));
});

//@skip -limit-cchttby- cchtt
// router.get('', verify, (req, res) => {
//     let limit = Number(req.query.limit)
//     let skip = Number(req.query.skip)
//     req.query.Cchttby === 'desc' ? Cchtt.find().limit(limit).skip(skip)
//         .sort({ date: 1 })
//         .then(cchtts => res.json(cchtts)) :
//         Cchtt.find().limit(limit).skip(skip)
//             .sort({ date: -1 })
//             .then(cchtts => res.json(cchtts));
// });

//@route GeT api/cchtts
//@desc Get all cchtts
//@access Public
router.get('/search', verify, async (req, res) => {
    let token = req.headers['auth-token']
    //console.log(jwt.verify(token, TOKEN_SECRET))
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

    var countCchtt = await Cchtt.find(paramsQuery)
        .countDocuments({}, (err, count) => {
            return count;
        });
    await Cchtt.find(paramsQuery)
        .skip(skip).limit(limit).populate("userId", "-password -__v -date")
        .sort({ date: -1 })
        .then(cchtts => res.status(200).json(
            {
                Data: { Row: cchtts, Total: countCchtt },
                Status: { StatusCode: 200, Message: 'OK' }
            }
        ));
});
//@route Get api/cchtt/collect-tools
//@desc Get all api/cchtt/collect-tools
router.get('/collect-tools', verify, (req, res) => {
    let startDate = new Date(req.query.startDate)
    let endDate = new Date(req.query.endDate)
    queryParams = {
        timeStart: { $gte: startDate, $lte: endDate }
    }
    Cchtt.find(queryParams)
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
//@route POST api/cchtts
//@desc Create an cchtts
//@access Public
router.post('/', verify, async (req, res) => {
    console.log(req.body)
    const WOExist = await Cchtt.findOne({ WO: req.body.WO });
    //console.log(WOExist)
    if (WOExist) return res.status(400).send('WO ' + WOExist.WO + ' đã tồn tại, vui lòng kiểm tra lại!')
    let date = new Date();
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let year = date.getYear() - 100;
    let lastWo = await Cchtt.findOne({}, {}, { sort: { 'date': -1 } }, function (err, cchtt) {
        return cchtt;
    });
    let lastmonth = lastWo ? Number(lastWo.PCT.split("/")[1]) : month;
    let pct;
    if (Number(month) !== lastmonth) {
        pct = 1;
    } else {
        pct = lastWo ? Number(lastWo.PCT.split("/")[0]) + 1 : '1';
    }
    //let pct = Number(lastWo.PCT.split("/")[0]) + 1;
    //console.log("last:" + lastWo);
    if (pct < 10) {
        pctT = "00" + pct;
    } else if (pct >= 10 && pct < 100) {
        pctT = "0" + pct;
    } else pctT = pct;
    //console.log("pct: " + pctT)
    const newCchtt = new Cchtt({
        userId: req.body.userId,
        toolId: req.body.toolId,
        WO: req.body.WO,
        location: req.body.location,
        KKS: req.body.KKS,
        PCT: pctT + "/" + month + "/" + year,
        NV: req.body.NV,
        note: req.body.note,
        content: req.body.content,
        timeStart: req.body.timeStart,
        timeStop: req.body.timeStop,
        status: req.body.status,
        statusTool: req.body.statusTool,
    });
    newCchtt.save()
        .then(cchtt => res.json(cchtt))
        .catch(err => res.json(err))
        ;
})

//@route DELETE api/cchtts:id
//@desc delete an cchtts
//@access Public
// router.delete('/:id', verify, async (req, res) => {
//     try {
//         var toolId = [];
//         await Cchtt.findByIdAndDelete({ _id: req.params.id }).then(wo => {
//             if (!wo) {
//                 return res.status(404).json({ error: "No Wo Found" });
//             }
//             else {
//                 toolId = wo.toolId;
//                 res.json(wo);
//             }
//         })
//         console.log(toolId);
//         toolId.forEach(_id => {
//             Tool.findByIdAndUpdate(_id, { $set: { status: 1 } }).then(toolDeleted => {
//                 if (!toolDeleted) {
//                     return res.status(404).json({ error: "No toolDelete Found" });
//                 } else {
//                     ;
//                     //res.status(200).json({ success: true });
//                 }
//             }
//             )
//         })
//     }
//     catch (err) {
//         res.status(404).json({ success: false })
//     }
// })

//update cchtt
router.patch('/:cchttId', verify, async (req, res) => {
    try {
        var toolId = [];
        const updateCchtt = await Cchtt.updateOne(
            { _id: req.params.cchttId },
            {
                $set: {
                    userId: req.body.userId,
                    toolId: req.body.toolId,
                    WO: req.body.WO,
                    location: req.body.location,
                    KKS: req.body.KKS,
                    PCT: req.body.PCT,
                    NV: req.body.NV,
                    note: req.body.note,
                    content: req.body.content,
                    timeStart: req.body.timeStart,
                    timeStop: req.body.timeStop,
                    status: req.body.status,
                    statusTool: req.body.statusTool,
                }
            })

        const statusComplete = req.body.status;
        //console.log(statusComplete);
        toolId = req.body.toolId;
        if (statusComplete == "COMPLETE") {
            toolId.forEach(tools => {
                //console.log(tools._id)
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
        res.json(updateCchtt);
        //console.log(toolId);
    } catch (err) {
        res.json({ message: err });
    }
})
//@route get cchtt by id
router.get('/:id', verify, (req, res) => {
    Cchtt.findById(req.params.id).populate("toolId", "-toolId -__v").populate("userId", "-password -__v").populate("NV", "-password -__v")
        .then(cchtt => {
            res.json(cchtt)
        })
})
router.get('/user/:id', verify, (req, res) => {
    Cchtt.find().populate("userId")
        .then(cchtt => {
            res.json(cchtt)
        })
})
module.exports = router;