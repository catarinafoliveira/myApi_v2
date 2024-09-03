const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class CarClass {
  static async createCar(data) {
    const car = new this(data);
    await car.save();
    return car;
  }

  static async getAllCars() {
    return await this.find().populate('owner').exec();
  }

  static async getCarById(id) {
    return await this.findById(id).populate('owner').exec();
  }

  static async getCarByPlate(plate) {
    return await this.findOne({ plate }).populate('owner').exec();
  }

  static async getCarsByOwnerDriverLicence(ownerDL) {
    const driver = await mongoose.model('Driver').findOne({ licence: ownerDL });
    if (!driver) {
      throw new Error('Driver not found');
    }
    return await this.find({ owner: driver._id }).populate('owner').exec();
  }

  static async updateCar(id, data) {
    const car = await this.findById(id).populate('owner');
    if (!car) {
      throw new Error('Car not found');
    }

    const { plate, date, ownerDL } = data;

    if (ownerDL) {
      const ownerDriver = await mongoose.model('Driver').findOne({ licence: ownerDL });
      if (!ownerDriver) {
        throw new Error('Driver not found');
      }
      car.owner = ownerDriver._id;
    }

    car.plate = plate || car.plate;
    car.date = date ? parseDateString(date) : car.date;

    await car.save();
    return car;
  }

  static async deleteCar(id) {
    const car = await this.findByIdAndDelete(id);
    if (!car) {
      throw new Error('Car not found');
    }
    return car;
  }
}

const CarSchema = new Schema({
  date: {
    type: Date,
    required: true,
    validate: [
      {
        validator: function (v) {
          return v < new Date();
        },
        message: (props) => `${props.value} is not a valid date or is in the future.`,
      },
    ],
  },
  plate: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        const year = this.date ? this.date.getFullYear() : new Date().getFullYear();
        const plateRegex = getPlateRegex(year);
        return plateRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid plate number for the given date.`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
});

function getPlateRegex(year) {
  const patterns = {
    pre1992: /^[A-Za-z]{2}-\d{2}-\d{2}$/,
    '1992to2005': /^\d{2}-\d{2}-[A-Za-z]{2}$/,
    '2005to2020': /^\d{2}-[A-Za-z]{2}-\d{2}$/,
    post2020: /^[A-Za-z]{2}-\d{2}-[A-Za-z]{2}$/,
  };

  if (year < 1992) {
    return patterns.pre1992;
  } else if (year >= 1992 && year <= 2005) {
    return patterns['1992to2005'];
  } else if (year > 2005 && year <= 2020) {
    return patterns['2005to2020'];
  } else {
    return patterns.post2020;
  }
}

function parseDateString(dateString) {
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

CarSchema.loadClass(CarClass);
module.exports = mongoose.model('Car', CarSchema);