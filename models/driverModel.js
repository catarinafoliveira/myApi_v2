const mongoose = require('mongoose');
const PersonModel = require('../models/personModel');
const Schema = mongoose.Schema;

class DriverClass {
  static async create(data) {
    const driver = new this(data);
    await driver.save();
  }
  static async getAll(){
    return await this.find().exec();
  }
  static async getById(id) {
    return await this.findById(id).exec();
  }
  static async getOneByData(data){
    return await this.findOne(data);
  }
  static async getAllByData(data){
    return await this.find(data);
  }
  static async update(id, data) {
    const driver = await this.findById(id);
    if (!driver) {
      throw new Error('Driver not found');
    }
    Object.assign(driver, data);
    await driver.save();
  }
  // static async delete(id) {
  //   const driver = await this.findById(id).exec();
  //   if (!driver) {
  //     throw new Error('Driver not found');
  //   }
  //   const carsWithOwner = await mongoose.model('Car').find({ owner: id }).exec();
  //   if (carsWithOwner.length > 0) {
  //     throw new Error('Cannot delete person because they are the owner of one or more cars.');
  //   }
  //   await driver.deleteOne();
  // }
}

const DriverSchema = new Schema({
    licence: {
        type: String, 
        unique: true, 
        match: /^[A-Za-z]{2}[0-9]{8}$/,
        minlength: 10,
        maxlength: 10
      }
});

DriverSchema.loadClass(DriverClass);

const Driver = PersonModel.discriminator('Driver', DriverSchema);
module.exports = Driver;