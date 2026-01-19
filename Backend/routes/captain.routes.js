const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const captainController = require('../controllers/captain.controller');


router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('Fullname must be at least 3 characters'),
    body('vehicle.color').isLength({ min: 2 }).withMessage('Vehicle color must be at least 2 characters'),
    body('vehicle.plate').isLength({ min: 5 }).withMessage('Vehicle plate must be at least 5 characters'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'van', 'truck']).withMessage('Invalid vehicle type')

    captainController.registerCaptain
]);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    captainController.loginCaptain
])

module.exports = router;