import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Datenanalyse from './Datenanalyse';
import Hersteller from './Hersteller';
import Leistung from './Leistung';
import Karte from './Karte';



const MainSeite: React.FC = () => {
  
  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        {/* Üstteki Fotoğraf */}
        <div className='header'>
          <img
            src="https://wallpaperaccess.com/full/1461880.jpg"
            alt="Picture-oben"
            style={{ width: '100%', height: 'auto' , backgroundPosition: 'bottom'}}
          />
        </div>


        {/* Tıklama Yerleri */}
        <div className="topnav">
          <Link to="/menu" className="link">Karte</Link>
          <Link to="/datenanalyse" className="link">Datenanalyse</Link>
          <Link to="/hersteller" className="link">Hersteller</Link>
          <Link to="/leistung" className="link">Leistung</Link>
        </div>

        {/* Yönlendirme Rotaları */}
        <Routes>
          <Route path="/menu" element={<Karte/>} />
          <Route path="/datenanalyse" element={<Datenanalyse />} />
          <Route path="/hersteller" element={<Hersteller />} />
          <Route path="/leistung" element={<Leistung />} />
        </Routes>

        <div className='footer'>
          <h1>The Wind Power <br />
            All rights reserved - 2005-2024 - Cookie Policy<br />
            Conditions of Use and Sale - Partners </h1>
        </div>

      </div>
    </Router>
  );
};

export default MainSeite;
