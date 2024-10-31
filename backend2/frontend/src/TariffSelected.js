import React from 'react';

function TariffSelected(props) {
  return (
    <div className="card">
      <h3 style={{color: '#ffffff'}}>{props.title}</h3>
      <div className="info">
        <h4>Name: </h4>
        <h5>{props.name}</h5>
      </div>
      <div className="info">
        <h4>Price: </h4>
        <h5>{props.price} ¢/kWh</h5>
      </div>
    </div>
  );
}

export default TariffSelected;