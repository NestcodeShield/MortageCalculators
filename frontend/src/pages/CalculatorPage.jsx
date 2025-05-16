import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CalculatorPage() {
  const { type } = useParams();
  const [calculator, setCalculator] = useState(null);
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  //ПОЛУЧЕНИЕ ДАННЫХ И ПРИСВОЕНИЕ ЗНАЧЕНИЙ ПО УМОЛЧАНИЮ
  useEffect(() => {
    async function fetchCalculator() {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/calculators/type/${type}`);

        setCalculator(data);

        const initialValues = {};
        data.fields.forEach(field => {
          initialValues[field.key] = '';
        });
        setValues(initialValues);
      } catch (err) {
        setError('Не удалось загрузить калькулятор.');
      }
    }
    fetchCalculator();
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculate();
  };

  //ФУНКЦИЯ РАСЧЕТА
  const calculate = () => {
    try {
      if (type === 'pension') {
        //ПЕНСИЯ
        const initial = parseFloat(values.initial);
        const contribution = parseFloat(values.contribution);
        const rate = parseFloat(values.rate) / 100;
        const term = parseInt(values.term, 10);

        if ([initial, contribution, rate, term].some(v => isNaN(v) || v < 0)) {
          throw new Error();
        }

        const futureValue = initial * Math.pow(1 + rate, term)
          + contribution * ((Math.pow(1 + rate, term) - 1) / rate);

        setResult({
          futureValue: futureValue.toFixed(2)
        });
      } else {
        //АВТО
        const amount = parseFloat(values.amount);
        const rate = parseFloat(values.rate);
        const term = parseInt(values.term, 10);

        if ([amount, rate, term].some(v => isNaN(v) || v <= 0)) {
          throw new Error();
        }

        const months = term * 12;
        const monthlyRate = rate / 100 / 12;
        const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        const totalPayment = monthlyPayment * months;

        setResult({
          monthlyPayment: monthlyPayment.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          totalInterest: (totalPayment - amount).toFixed(2)
        });
      }

      setError('');
    } catch {
      setError('Пожалуйста, заполните все поля корректно.');
      setResult(null);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!calculator) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>{calculator.name}</h2>

      <form onSubmit={handleSubmit}>
        {calculator.fields.map((field) => (
          <div key={field.key} style={{ marginBottom: '10px' }}>
            <label>{field.label}:</label>
            <input
              type={field.type}
              name={field.key}
              value={values[field.key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Рассчитать</button>
      </form>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Результаты:</h3>
          {type === 'pension' ? (
            <p>Накопленная сумма: {result.futureValue} ₽</p>
          ) : (
            <>
              <p>Ежемесячный платеж: {result.monthlyPayment} ₽</p>
              <p>Общая сумма выплат: {result.totalPayment} ₽</p>
              <p>Общая переплата: {result.totalInterest} ₽</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CalculatorPage;
