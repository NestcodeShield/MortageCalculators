const express = require('express');
const router = express.Router();
const Calculator = require('../models/Calculator');

// Получить все калькуляторы
router.get('/', async (req, res) => {
  try {
    const calculators = await Calculator.find();
    res.json(calculators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить калькулятор по типу (ВАЖНО: этот маршрут должен быть ПЕРЕД ':id')
router.get('/type/:type', async (req, res) => {
  try {
    const calculator = await Calculator.findOne({ type: req.params.type });
    if (!calculator) return res.status(404).json({ message: 'Калькулятор не найден' });
    res.json(calculator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить один калькулятор по ID
router.get('/:id', async (req, res) => {
  try {
    const calculator = await Calculator.findById(req.params.id);
    if (!calculator) return res.status(404).json({ message: 'Калькулятор не найден' });
    res.json(calculator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Создать новый калькулятор
router.post('/', async (req, res) => {
  const { name, type, defaultRate, fields } = req.body;

  const calculator = new Calculator({ name, type, defaultRate, fields });

  try {
    const newCalculator = await calculator.save();
    res.status(201).json(newCalculator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Обновить калькулятор
router.put('/:id', async (req, res) => {
  try {
    const calculator = await Calculator.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!calculator) return res.status(404).json({ message: 'Калькулятор не найден' });
    res.json(calculator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Удалить калькулятор
router.delete('/:id', async (req, res) => {
  try {
    const calculator = await Calculator.findByIdAndDelete(req.params.id);
    if (!calculator) return res.status(404).json({ message: 'Калькулятор не найден' });
    res.json({ message: 'Калькулятор удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
