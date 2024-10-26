import React, { useState } from "react";
import TariffSelected from "./TariffSelected";
import Table from "./Table";
import {tariffPriceEasyMethod} from "./tariff-price-easymethod";
import LineChart from "./LineChart";

function UtilityRate() {
  const [address, setAddress] = useState("");
  const [consumption, setConsumption] = useState(1000);
  const [escalator, setEscalator] = useState(4);
  const [mostLikelyTariff, setMostLikelyTariff] = useState("");
  const [tariffSelected, setTariffSelected] = useState("");
  const [tariffs, setTariffs] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUtilityRate = () => {
    if (address === "" || isNaN(consumption) || isNaN(escalator) || consumption <1000 || consumption > 10000 || escalator <4 || escalator > 10) {
      alert("Fill out all the inputs well before searching");
    } else {
      setLoading(true);
      setMostLikelyTariff("");
      setTariffSelected("");
      setTariffs("");
      setError(null);

      fetch(
        `https://api.openei.org/utility_rates?version=7&detail=full&format=json&api_key=VOeIh4rvwI0CjtMciHqOMb04ax2GQxQIoYuSgMiy&effective_on_date=1640995199&address=${address}`
      )
        .then((response) => response.json())
        .then((data) => {
          const items = data.items;
          const tariff = items.find(
            (item) => item.approved === true && item.is_default === true
          );
          setMostLikelyTariff(tariff);
          setTariffs(items);

          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données:", error);
          setError(
            "Une erreur est survenue lors de la récupération des données."
          );
          setLoading(false);
        });
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleConsumptionChange = (e) => {
    setConsumption(parseInt(e.target.value));
  };

  const handleEscalatorChange = (e) => {
    setEscalator(parseInt(e.target.value));
  };

  const handleTariffSelected = (tariff) => {
    setTariffSelected(tariff);
  };

  return (
    <div>
      <h1 style={{margin:'0 0 20px 0'}}>Utility rate</h1>
      <div className="search">
        <div className="input">
          <h4>Enter US address</h4>
          <input
            type="text"
            placeholder="Enter US address"
            value={address}
            required
            onChange={handleAddressChange}
          />
        </div>
        <div className="input">
          <h4>Enter a kWh Consumption Value (min 1000: max 10000)</h4>
          <input
            type="number"
            placeholder="Enter a kWh Consumption Value (min 1000: max 10000)"
            min="1000"
            max="10000"
            value={consumption}
            required
            onChange={handleConsumptionChange}
          />
        </div>
        <div className="input">
          <h4>Set a percentage escalator from 4% to 10%</h4>
          <input
            type="number"
            placeholder="Set a percentage escalator from 4% to 10%"
            min="4"
            max="10"
            value={escalator}
            required
            onChange={handleEscalatorChange}
          />
        </div>
        <button onClick={fetchUtilityRate}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="tariff-selected">
        {mostLikelyTariff && (
          <TariffSelected
            title="Most Likely Tariff"
            price={tariffPriceEasyMethod(mostLikelyTariff.energyratestructure, consumption)}
            name={mostLikelyTariff.name}
          />
        )}
        {tariffSelected && (
          <TariffSelected
            title="Tariff selected"
            price={tariffPriceEasyMethod(tariffSelected.energyratestructure, consumption)}
            name={tariffSelected.name}
          />
        )}
        {tariffSelected && (
          <LineChart
            energyratestructure={tariffSelected.energyratestructure}
            consumption={consumption}
            escalator={escalator}
          />
        )}
      </div>
      <div className="tariffs-loaded">
        {tariffs && (
          <Table consumption={consumption} data={tariffs} OnTariffSelected={handleTariffSelected} />
        )}
      </div>
    </div>
  );
}

export default UtilityRate;
