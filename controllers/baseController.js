const PersonModel = require('../models/personModel');
const CarModel = require('../models/carModel');

exports.delete = async function(req, res, model) {
    const modelName = model.modelName; 
    console.log(`DELETE: /api/${modelName.toLowerCase()}s : ${req.params.id}`);
    try {
        const person = await model.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ message: `${modelName} not found` });
        }
        const carsWithOwner = await CarModel.find({ owner: req.params.id });
        if (carsWithOwner.length > 0) {
            return res.status(400).json({ error: `Cannot delete ${modelName.toLowerCase()} because they are the owner of one or more cars.` });
        }
        await person.deleteOne();
        res.status(200).json({ message: `${modelName} deleted!` });
    } catch (err) {
        res.status(500).json({ error: `Error deleting ${modelName.toLowerCase()}`, details: err });
    }
};