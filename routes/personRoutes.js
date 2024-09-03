var express = require('express'); 
var router = express.Router();
const PersonController = require('../controllers/personController');

router.post('/', PersonController.createPerson);
router.get('/', PersonController.getAllPersons);
router.get('/id/:id', PersonController.getPersonById);
router.get('/name/:name', PersonController.getPersonByName);
router.get('/idcard/:idcard', PersonController.getPersonByIdCard);
router.put('/:id', PersonController.updatePerson);
router.delete('/:id', PersonController.deletePerson);

module.exports = router;