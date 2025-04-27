import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function CalculatorPage() {
  const { type } = useParams();
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Функция для расчета ипотечного платежа
  const calculateMortgage = () => {
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const months = parseInt(years) * 12;

    if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || principal <= 0 || annualRate <= 0 || months <= 0) {
      setError('Пожалуйста, заполните все поля корректно.');
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = payment * months;

    setResult({
      monthlyPayment: payment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: (totalPayment - principal).toFixed(2),
    });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMortgage();
  };

  return (
    <div>
      <h2>Калькулятор: {type}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Сумма кредита:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Годовая процентная ставка (%):</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Срок кредита (лет):</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            required
          />
        </div>
        <button type="submit">Рассчитать</button>
      </form>

      {result && (
        <div>
          <h3>Результаты расчета:</h3>
          <p>Ежемесячный платеж: {result.monthlyPayment} ₽</p>
          <p>Общая сумма выплат: {result.totalPayment} ₽</p>
          <p>Общая переплата: {result.totalInterest} ₽</p>
        </div>
      )}
    </div>
  );
}

export default CalculatorPage;
