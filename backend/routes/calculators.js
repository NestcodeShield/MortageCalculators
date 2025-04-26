// routes/calculators.js
const express = require('express');
const router = express.Router();
const Calculator = require('../models/Calculator');

// GET /api/calculators
router.get('/', async (req, res) => {
  try { res.json(await Calculator.find()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/calculators
router.post('/', async (req, res) => {
  const { name, type, defaultRate, fields, template } = req.body;
  try {
    const calc = new Calculator({ name, type, defaultRate, fields, template });
    res.status(201).json(await calc.save());
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const calc = await Calculator.findById(req.params.id);
    if (!calc) return res.status(404).json({ message: 'Not Found' });
    res.json(calc);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET by type
router.get('/type/:type', async (req, res) => {
  try {
    const calc = await Calculator.findOne({ type: req.params.type });
    if (!calc) return res.status(404).json({ message: 'Not Found' });
    res.json(calc);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/calculators/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Calculator.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not Found' });
    res.json(updated);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/calculators/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Calculator.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not Found' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
