const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const calculatorRoutes = require('./routes/calculators');
const Calculator = require('./models/Calculator');  // ← импорт модели

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Наши дефолтные калькуляторы для сидирования
const defaultCalcs = [
  {
    name: 'Ипотечный калькулятор',
    type: 'mortgage',
    defaultRate: 9.6,
    fields: [
      { key: 'amount', label: 'Сумма кредита', type: 'number' },
      { key: 'term',   label: 'Срок кредита (лет)', type: 'number' },
      { key: 'rate',   label: 'Процентная ставка (%)', type: 'number' },
    ],
    template: {
      amount: 'Сумма кредита',
      term:   'Срок кредита (лет)',
      rate:   'Процентная ставка (%)'
    }
  },
  {
    name: 'Автокредит',
    type: 'car',
    defaultRate: 3.5,
    fields: [
      { key: 'amount', label: 'Сумма кредита', type: 'number' },
      { key: 'term',   label: 'Срок кредита (лет)', type: 'number' },
      { key: 'rate',   label: 'Процентная ставка (%)', type: 'number' },
    ],
    template: {
      amount: 'Сумма кредита',
      term:   'Срок кредита (лет)',
      rate:   'Процентная ставка (%)'
    }
  },
  {
    name: 'Потребительский кредит',
    type: 'consumer',
    defaultRate: 14.5,
    fields: [
      { key: 'amount', label: 'Сумма кредита', type: 'number' },
      { key: 'term',   label: 'Срок кредита (лет)', type: 'number' },
      { key: 'rate',   label: 'Процентная ставка (%)', type: 'number' },
    ],
    template: {
      amount: 'Сумма кредита',
      term:   'Срок кредита (лет)',
      rate:   'Процентная ставка (%)'
    }
  },
  {
    name: 'Пенсионный калькулятор',
    type: 'pension',
    defaultRate: 0,
    fields: [
      { key: 'initial',  label: 'Начальная сумма', type: 'number' },
      { key: 'contrib',  label: 'Годовые взносы', type: 'number' },
      { key: 'years',    label: 'Срок (лет)', type: 'number' },
      { key: 'rate',     label: 'Процентная ставка (%)', type: 'number' },
    ],
    template: {
      initial: 'Начальная сумма',
      contrib: 'Годовые взносы',
      years:   'Срок (лет)',
      rate:    'Процентная ставка (%)'
    }
  }
];

// MongoDB connection + сидирование
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    // Проверяем, есть ли уже данные
    const count = await Calculator.countDocuments();
    if (count === 0) {
      await Calculator.insertMany(defaultCalcs);
      console.log('Seeded default calculators');
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Routes
app.use('/api/calculators', calculatorRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
