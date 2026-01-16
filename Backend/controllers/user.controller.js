const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
      const error = validationResult(req);
      if(!error.isEmpty()){
            return res.status(400).json({errors: error.array()});
      }
      const { fullname, email, password } = req.body;

     const hashedPassword = await userModel.hashPassword(password);

      const user = await userService.createUser({
           firstname: fullname.firstname,
           lastname: fullname.lastname,
            email,
          password: password
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
         res.status(200).json({ user, token });
}