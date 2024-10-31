import React from "react";
import "./Table.css";

const Table = ({ data, OnTariffSelected, consumption }) => {

  const handleTariffSelected = (item) => {
    OnTariffSelected(item);
  };
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Tariff Name</th>
            <th>Utility</th>
            <th>Cost for the first year</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} onClick={() => handleTariffSelected(item)}>
              <td>{item.name}</td>
              <td>{item.utility}</td>
              <td>{item.price_first_year} $/kWh</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
