var express = require('express'); 
var router = express.Router();
const CarController = require('../controllers/carController');

router.post('/', CarController.createCar);
router.get('/', CarController.getAllCars);
router.get('/id/:id', CarController.getCarById);
router.get('/plate/:plate', CarController.getCarByPlate);
router.get('/owner/:dl', CarController.getCarsByOwnerDriverLicence);
router.put('/',CarController.updateCar);
router.delete('/',CarController.deleteCar);

module.exports = router;