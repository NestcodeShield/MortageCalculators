import React, { useState, useEffect } from 'react';
import {
  getCalculators,
  createCalculator,
  updateCalculator,
  deleteCalculator
} from '../api';
import './Admin.css';

//ШАБЛОНЫ КАЛЬКУЛЯТОРОВ
const CATEGORY_TEMPLATES = {
  mortgage: {
    defaultRate: 9.6,
    fields: [
      { key: 'amount', label: 'Сумма кредита', type: 'number' },
      { key: 'term',   label: 'Срок кредита (лет)', type: 'number' },
      { key: 'rate',   label: 'Процентная ставка (%)', type: 'number' },
    ]
  },
  car: {
    defaultRate: 3.5,
    fields: [
      { key: 'amount',    label: 'Сумма кредита',        type: 'number' },
      { key: 'term',      label: 'Срок кредита (лет)',   type: 'number' },
      { key: 'rate',      label: 'Процентная ставка (%)',type: 'number' },
      { key: 'vehicleCost', label: 'Стоимость авто',     type: 'number' },
    ]
  },
  consumer: {
    defaultRate: 14.5,
    fields: [
      { key: 'amount', label: 'Сумма кредита',         type: 'number' },
      { key: 'term',   label: 'Срок кредита (лет)',    type: 'number' },
      { key: 'rate',   label: 'Процентная ставка (%)', type: 'number' },
      { key: 'income', label: 'Ежемесячный доход',     type: 'number' },
    ]
  },
  pension: {
    defaultRate: 0,
    fields: [
      { key: 'initial',  label: 'Начальная сумма',     type: 'number' },
      { key: 'contribution', label: 'Взнос в год',    type: 'number' },
      { key: 'years',    label: 'Срок (лет)',          type: 'number' },
      { key: 'rate',     label: 'Ожидаемая доходность (%)', type: 'number' },
    ]
  }
};  

export default function Admin() {
  const [calculators, setCalculators] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: '',
    defaultRate: '',
    fields: []
  });
  const [ editingId, setEditingId ] = useState(null);
  const [ error, setError ] = useState('');

  useEffect(() => {
    fetchCalculators();
  }, []);

  async function fetchCalculators() {
    try {
      const data = await getCalculators();
      setCalculators(data);
    } catch {
      setError('Не удалось загрузить список калькуляторов');
    }
  }

  function handleCategoryChange(e) {
    const type = e.target.value;
    const template = CATEGORY_TEMPLATES[type] || { defaultRate: '', fields: [] };
    setForm({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      defaultRate: template.defaultRate,
      fields: template.fields.map(f => ({ ...f }))
    });
  }

  function handleFieldChange(index, key, value) {
    const newFields = [...form.fields];
    newFields[index][key] = value;
    setForm({ ...form, fields: newFields });
  }
  //НОВОЕ ПОЛЕ КАЛЬКУЛЯТОРА
  function addField() {
    setForm({
      ...form,
      fields: [...form.fields, { key: '', label: '', type: 'text' }]
    });
  }

  function removeField(index) {
    const newFields = form.fields.filter((_, i) => i !== index);
    setForm({ ...form, fields: newFields });
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCalculator(editingId, form);
      } else {
        await createCalculator(form);
      }
      await fetchCalculators();
      resetForm();
    } catch {
      setError('Ошибка при сохранении калькулятора');
    }
  }

  function handleEdit(calc) {
    setEditingId(calc._id);
    setForm({
      name: calc.name,
      type: calc.type,
      defaultRate: calc.defaultRate,
      fields: calc.fields.map(f => ({ key: f.key, label: f.label, type: f.type }))
    });
  }

  async function handleDelete(id) {
    try {
      await deleteCalculator(id);
      fetchCalculators();
    } catch {
      setError('Не удалось удалить калькулятор');
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: '', type: '', defaultRate: '', fields: [] });
    setError('');
  }

  return (
    <div className="admin">
      <h2>{editingId ? 'Редактировать калькулятор' : 'Новый калькулятор'}</h2>
      <form onSubmit={handleSave} className="admin-form">
        <div className="form-group">
          <label>Категория:</label>
          <select value={form.type} onChange={handleCategoryChange} required>
            <option value="">Выберите категорию</option>
            {Object.keys(CATEGORY_TEMPLATES).map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Название:</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ставка по умолчанию (%):</label>
          <input
            type="number"
            value={form.defaultRate}
            onChange={e => setForm({ ...form, defaultRate: e.target.value })}
            required
          />
        </div>

        <h3>Поля калькулятора</h3>
        {form.fields.map((field, i) => (
          <div key={i} className="field-row">
            <input
              type="text"
              placeholder="Ключ поля"
              value={field.key}
              onChange={e => handleFieldChange(i, 'key', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Метка поля"
              value={field.label}
              onChange={e => handleFieldChange(i, 'label', e.target.value)}
              required
            />
            <select
              value={field.type}
              onChange={e => handleFieldChange(i, 'type', e.target.value)}
            >
              <option value="text">Текст</option>
              <option value="number">Число</option>
              <option value="date">Дата</option>
            </select>
            <button type="button" onClick={() => removeField(i)}>Удалить</button>
          </div>
        ))}
        <button type="button" onClick={addField}>Добавить поле</button>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Сохранить' : 'Создать'}</button>
          {editingId && <button type="button" onClick={resetForm}>Отмена</button>}
        </div>
        {error && <p className="error">{error}</p>}
      </form>
      <h2>Существующие калькуляторы</h2>
      <ul className="calc-list">
        {calculators.map(calc => (
          <li key={calc._id} className="calc-item">
            <span>{calc.name} ({calc.type})</span>
            <div>
              <button onClick={() => handleEdit(calc)}>Редактировать</button>
              <button onClick={() => handleDelete(calc._id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
