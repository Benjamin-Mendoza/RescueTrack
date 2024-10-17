import React from 'react';
import './home.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">
          Bienvenido a <span className="rescue">Rescue</span><span className="track">Track</span>
        </h1>
        <p className="homepage-text">
          <span className="rescue">Rescue</span><span className="track">Track</span> es la herramienta ideal para la gestión de vehículos de emergencia. Su objetivo es garantizar que cada vehículo esté en óptimas condiciones para enfrentar cualquier situación.
        </p>
        <p className="homepage-text">
          Con <span className="rescue">Rescue</span><span className="track">Track</span>, la seguridad y eficiencia de los vehículos de bomberos de Talcahuano están aseguradas.
        </p>
        <p className="homepage-subtitle">
          ¡<span className="rescue">Rescue</span><span className="track">Track</span> para un futuro más seguro!
        </p>
      </div>
    </div>
  );
};

export default HomePage;

