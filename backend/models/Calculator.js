// models/Calculator.js
const mongoose = require('mongoose');
const FieldSchema = new mongoose.Schema({
  key:   { type: String, required: true },
  label: { type: String, required: true },
  type:  { type: String, required: true }
});
const CalculatorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  type:        { type: String, required: true, unique: true },
  defaultRate: { type: Number, required: true },
  fields:      { type: [FieldSchema], required: true },
  template:    { type: Object, default: {} }
}, { timestamps: true });
module.exports = mongoose.model('Calculator', CalculatorSchema);
