const PersonModel = require('../models/personModel');
const baseController = require('./baseController');

exports.createPerson = async function(req, res) {
    console.log("POST: /api/persons - " + JSON.stringify(req.body));
    try {
        await PersonModel.create(req.body);
        res.status(201).json({ message: 'Person created!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate idCard. Please use a unique idCard number.' });
        } else {
            res.status(500).json({ error: 'Error saving person', details: err });
        }
    }
};

exports.getAllPersons = async function(req, res) {
    console.log("GET: /api/persons");
    try {
        const persons = await PersonModel.getAll();
        res.status(200).json(persons);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving persons', details: err });
    }
};

exports.getPersonById = async function(req, res) {
    console.log("GET: /api/persons by Id: " + req.params.id);
    try {
        const person = await PersonModel.getById(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(200).json(person);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving person', details: err });
    }
};

exports.getPersonByName = async function(req, res) {
    console.log("GET: /api/persons by Name: " + req.params.name);
    try {
        const persons = await PersonModel.getAllByData({ name: req.params.name });
        res.status(200).json(persons);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving persons', details: err });
    }
};

exports.getPersonByIdCard = async function(req, res) {
    console.log("GET: /api/persons by IdCard: " + req.params.idcard);
    try {
        const person = await PersonModel.getOneByData({ idCard: req.params.idcard });
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(200).json(person);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving persons', details: err });
    }
};

exports.updatePerson = async function(req, res) {
    console.log("PUT: /api/persons : " + req.params.id + " - " + JSON.stringify(req.body));
    try {
        await PersonModel.update(req.params.id, req.body);
        res.status(200).json({ message: 'Person updated!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate idCard. Please use a unique idCard number.' });
        } else {
            res.status(500).json({ error: 'Error updating person', details: err });
        }
    }
};

exports.deletePerson = async function(req, res) {
    baseController.delete(req, res, PersonModel);
};