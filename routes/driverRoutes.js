var express = require('express'); 
var router = express.Router();
const DriverController = require('../controllers/driverController');

router.post('/', DriverController.createDriver);
router.get('/', DriverController.getAllDrivers);
router.get('/id/:id', DriverController.getDriverById);
router.get('/name/:name', DriverController.getDriverByName);
router.get('/idcard/:idcard', DriverController.getDriverByIdCard);
router.get('/dl/:dl', DriverController.getDriverByLicence);
router.put('/:id',DriverController.updateDriver);
router.delete('/:id',DriverController.deleteDriver);

module.exports = router;