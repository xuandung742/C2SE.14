const mongoose = require("mongoose");

const healthFormSchema = mongoose.Schema({
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  dietary: {
    type: String,
    enum: ['vegan', 'vegetarian', 'omnivorous', 'pescatarian'],
    default: 'omnivorous'
  },
  activityLevel: {
    type: String,
    enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
    default: "Lightly Active",
    required: true,
  },
  healthConditions: {
    type: [String],
    enum: ['Kidney Disease', 'Hypertension', 'Heart Disease', 'Diabetes', 'Acne', 'Osteoporosis'],
  },
  userId: {
    type: String,
    required: true
  }
});

healthFormSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

healthFormSchema.set("toJSON", {
  virtuals: true,
});

exports.HealthForm = mongoose.model("HealthForm", healthFormSchema);
exports.healthFormSchema = healthFormSchema;
