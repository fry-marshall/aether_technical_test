import React, { useState } from "react";
import TariffSelected from "./TariffSelected";
import Table from "./Table";
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
    if (
      address === "" ||
      isNaN(consumption) ||
      isNaN(escalator) ||
      consumption < 1000 ||
      consumption > 10000 ||
      escalator < 4 ||
      escalator > 10
    ) {
      alert("Fill out all the inputs well before searching");
    } else {
      setLoading(true);
      setMostLikelyTariff("");
      setTariffSelected("");
      setTariffs("");
      setError(null);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic cm9vdDowMDAwMDAwMA==",
        },
        body: JSON.stringify({
          address,
          consumption,
          escalator
        }),
      };
      fetch("http://127.0.0.1:8000/utilityrate/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data.error){
          throw new Error(data.error)
        }
        setLoading("")
        setTariffs(data.items)
        const mostLikelyTariff = data.items.find(item => item.is_more_likely_tariff === true )
        setMostLikelyTariff(mostLikelyTariff)
      })
      .catch((e) => {
        setError(e)
        console.log(e);
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
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDowMDAwMDAwMA==",
      },
      body: JSON.stringify({
        address,
        openEI_id: tariff.openEI_id,
        tariff_name: tariff.name,
        pricing_matrix: tariff.pricing_matrix,
        average_price: tariff.average_price
      }),
    };
    fetch("http://127.0.0.1:8000/projects/create", requestOptions)
    .catch((e) => {
        setError(e)
        console.log(e);
      });

  };

  return (
    <div>
      <h1 style={{ margin: "0 0 20px 0" }}>Utility rate</h1>
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
            price={mostLikelyTariff.average_price}
            name={mostLikelyTariff.name}
          />
        )}
        {tariffSelected && (
          <TariffSelected
            title="Tariff selected"
            price={tariffSelected.average_price}
            name={tariffSelected.name}
          />
        )}
        {tariffSelected && (
          <LineChart
            data={tariffSelected.graphdata}
          />
        )}
      </div>
      <div className="tariffs-loaded">
        {tariffs && (
          <Table
            data={tariffs}
            OnTariffSelected={handleTariffSelected}
          />
        )}
      </div>
    </div>
  );
}

export default UtilityRate;
