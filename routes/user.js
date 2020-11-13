const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { resgisterValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const TOKEN_SECRET = require('./../config/secretToken').secretToken;
//validation

router.post("/register", async (req, res) => {

    //let validate the data before we a user
    const { error } = resgisterValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    //checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email ' + emailExist.email + ' is already exist')
    //hash pasword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');
    
        const token = jwt.sign({ id: savedUser._id }, TOKEN_SECRET, {
          expiresIn: 3600
        });
    
        res.status(200).json({
          token,
          user: {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email
          }
        });
       
    } catch (err) {
        res.status(400).send(err)
    }

})
//login
router.post('/login', async (req, res) => {

    //let validate the data before we a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.status(400).send('Email is not already exist')
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    //create and assign a token
    const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);
    console.log(token)
    res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    //res.header('auth-token', token).send(token);
    //res.send('login')
})


router.get('/user', verify, (req, res) => {
    User.findById(req.user._id)
        .select("-password") //ko gui password ra ngoai
        .then(user => {
            res.json(user)
        })
})

module.exports = router;