const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const BlacklistToken = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
      const error = validationResult(req);
      if(!error.isEmpty()){
            return res.status(400).json({errors: error.array()});
      }
      const { fullname, email, password } = req.body;

      // Assuming fullname is a string, split into firstname and lastname
      let firstname = '';
      let lastname = '';
      if (typeof fullname === 'string') {
            const names = fullname.trim().split(' ');
            firstname = names[0] || '';
            lastname = names.slice(1).join(' ') || '';
      } else if (fullname && typeof fullname === 'object') {
            firstname = fullname.firstname || '';
            lastname = fullname.lastname || '';
      }

      const hashedPassword = await userModel.hashPassword(password);

      const user = await userService.createUser({
           fullname: { firstname, lastname },
           email,
           password: hashedPassword // Use hashed password
      });
      const token = user.generateAuthToken();
      res.status(201).json({ user, token });
}

module.exports.loginUser = async(req,res,next) => {
         const {email,password} = req.body;


         if(!email || !password){
                  return res.status(400).json({message: "Email and password are required"});
         }

         const user = await userModel.findOne({
               email
         }).select('+password');


         if(!user){
                  return res.status(401).json({message: "Invalid credentials"});
         }

         const isMatch = await user.comparePassword(password);
         if(!isMatch){
                  return res.status(401).json({message: "Invalid credentials"});
         }


         const token = user.generateAuthToken();
         res.cookie('token', token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  maxAge: 3600000
         })
         // Remove password from user object before sending response
         const userObj = user.toObject();
         delete userObj.password;
         res.status(200).json({ user: userObj, token });
}

module.exports.getUserProfile = async(req,res,next) => {
      res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
      try {
            const authHeader = req.headers.authorization;
            let token = null;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                  token = authHeader.split(' ')[1];
            } else if (req.cookies && req.cookies.token) {
                  token = req.cookies.token;
            }
            if (!token) {
                  return res.status(400).json({ message: 'No token provided' });
            }
            await BlacklistToken.create({ token });
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
      } catch (err) {
            next(err);
      }
}

