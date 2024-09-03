const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class PersonClass {
  static async create(data) {
    const person = new this(data);
    await person.save();
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
    const person = await this.findById(id);
    if (!person) {
      throw new Error('Person not found');
    }
    Object.assign(person, data);
    await person.save();
  }
  static async delete(id) {
    const person = await this.findById(id).exec();
    if (!person) {
      throw new Error('Person not found');
    }
    const carsWithOwner = await mongoose.model('Car').find({ owner: id }).exec();
    if (carsWithOwner.length > 0) {
      throw new Error('Cannot delete person because they are the owner of one or more cars.');
    }
    await person.deleteOne();
  }
}

const PersonSchema = new Schema({
  name: String,
  idCard: {
    type: String, 
    unique: true, 
    match: [/^[0-9]{9}$/, 'idCard must be exactly 9 numerical characters'],
    minlength: [9, 'idCard must be exactly 9 numerical characters'],
    maxlength: [9, 'idCard must be exactly 9 numerical characters']
  }
});

PersonSchema.loadClass(PersonClass);

const Person = mongoose.model('Person', PersonSchema);
module.exports = Person;