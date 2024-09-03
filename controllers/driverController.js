const DriverModel = require('../models/driverModel');
const baseController = require('./baseController');

exports.createDriver = async function(req, res) {
    console.log("POST: /api/drivers - " + JSON.stringify(req.body));
    try {
        DriverModel.create(req.body);
        res.status(201).json({ message: 'Driver created!'});
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate idCard or licence. Please use unique values.' });
        } else {
            res.status(500).json({ error: 'Error saving driver', details: err.message });
        }
    }
};

exports.getAllDrivers = async function(req, res) {
    console.log("GET: /api/drivers");
    try {
        const divers = await DriverModel.getAll();
        res.status(200).json(divers);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving drivers', details: err });
    }
};

exports.getDriverById = async function(req, res) {
    console.log("GET: /api/drivers by Id: " + req.params.id);
    try {
        const driver = await DriverModel.getById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving driver', details: err });
    }
};

exports.getDriverByName = async function(req, res) {
    console.log("GET: /api/drivers by Name: " + req.params.name);
    try {
        const drivers = await DriverModel.getAllByData({ name: req.params.name });
        res.status(200).json(drivers);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving drivers', details: err });
    }
};

exports.getDriverByIdCard = async function(req, res) {
    console.log("GET: /api/drivers by IdCard: " + req.params.idcard);
    try {
        const driver = await DriverModel.getOneByData({ idCard: req.params.idcard });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving driver', details: err });
    }
};

exports.getDriverByLicence = async function(req, res) {
    console.log("GET: /api/drivers/ by licence: " + req.params.dl);
    try {
        const driver = await DriverModel.getOneByData({ licence: req.params.dl });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving driver', details: err });
    }
};

exports.updateDriver = async function(req, res) {
    console.log("PUT: /api/drivers/" + req.params.id + " - " + JSON.stringify(req.body));
    try {
        DriverModel.update(req.body);
        res.status(200).json({ message: 'Driver updated!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate idCard or licence. Please use unique values.' });
        } else {
            res.status(500).json({ error: 'Error updating driver', details: err.message });
        }
    }
};

exports.deleteDriver = async function(req, res) {
    baseController.delete(req, res, DriverModel);
};