import React from "react";
import "./Table.css";
import {calculateCostForTheFirstYear} from "./tariff-price-easymethod";

export 

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
          {data.map((item) => (
            <tr key={item.label} onClick={() => handleTariffSelected(item)}>
              <td>{item.name}</td>
              <td>{item.utility}</td>
              <td>{calculateCostForTheFirstYear(item.energyratestructure, consumption)} ¢</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
