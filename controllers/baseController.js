const PersonModel = require('../models/personModel');
const CarModel = require('../models/carModel');

exports.delete = async function(req, res, model) {
    const modelName = model.modelName; // This gives you the name of the model ('Person' or 'Driver')
    console.log(`DELETE: /api/${modelName.toLowerCase()}s : ${req.params.id}`);
    try {
        await model.deletePerson(req.params.id);
        res.status(200).json({ message: `${modelName} deleted!` });
    } catch (err) {
        handleError(err, res);
    }
};