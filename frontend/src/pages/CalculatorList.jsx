import { useState, useEffect } from 'react';
import { getCalculators, updateCalculator } from '../api';
//СПИСОК КАЛЬКУЛЯТОРОВ

function CalculatorList() {
  const [calculators, setCalculators] = useState([]);

  useEffect(() => {
    const fetchCalculators = async () => {
      const data = await getCalculators();
      setCalculators(data);
    };
    fetchCalculators();
  }, []);


  const handleEdit = async (id, updatedFields) => {
    await updateCalculator(id, { fields: updatedFields });
    const updatedCalculators = calculators.map(calc => 
      calc._id === id ? { ...calc, fields: updatedFields } : calc
    );
    setCalculators(updatedCalculators);
  };

  return (
    <div>
      <h2>Список калькуляторов</h2>
      {calculators.map(calculator => (
        <div key={calculator._id}>
          <h3>{calculator.name}</h3>
          <ul>
            {calculator.fields.map((field, index) => (
              <li key={index}>
                <input 
                  type="text" 
                  value={field.label} 
                  onChange={(e) => {
                    const newFields = [...calculator.fields];
                    newFields[index].label = e.target.value;
                    handleEdit(calculator._id, newFields);
                  }} 
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default CalculatorList;
