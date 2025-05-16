import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCalculators } from '../api';
import './Home.css'

function Home() {
  const [calculators, setCalculators] = useState([]);

  //ЗАПРОС НА ПОЛУЧЕНИЕ СПИСКА
  useEffect(() => {
    const fetchCalculators = async () => {
      try {
        const data = await getCalculators();
        setCalculators(data);
      } catch (error) {
        console.error('Ошибка при загрузке калькуляторов:', error);
      }
    };

    fetchCalculators();
  }, []);

  return (
    //CПИСОК
    <div>
      <h2>Главная страница</h2>
      <p>Список доступных калькуляторов:</p>
      <ul className="home-list">
        {calculators.map(calculator => (
          <li key={calculator._id}>
            <Link to={`/calculator/${calculator.type}`}>{calculator.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
