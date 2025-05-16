import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


//ШАПКА
function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/admin">Админ-панель</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;