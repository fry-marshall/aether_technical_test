/**
 * Calculates the average tariff for a period based on tiered pricing.
 */
function computeTariffForAPeriod(period, consumption) {
  let total = 0;             
  let remainConsumption = consumption;  // Remaining consumption to apply to tiers.

  // Loop through each tier in the period
  for (let i = 0; i < period.length; i++) {
    const { rate } = period[i];     
    const max = period[i].max ?? Infinity;

    // Add cost for remaining consumption at the current rate
    total += remainConsumption * rate;

    // Update remaining consumption based on tier limit
    remainConsumption = max - remainConsumption;

    // Stop if the current tier covers the remaining consumption
    if (remainConsumption < 0){
      remainConsumption = -remainConsumption;
    }
    else break;
  }

  // Return the average cost per unit of consumption
  return total / consumption;
}


function tariffPriceEasyMethod(energyratestructure, consumption) {
  let totalPrice = 0;

  for (const period of energyratestructure) {
    totalPrice += computeTariffForAPeriod(period, consumption)
  }
  return (totalPrice / energyratestructure.length).toFixed(5)
}

function calculateCostForTheFirstYear(energyratestructure, consumption){
  return (tariffPriceEasyMethod(energyratestructure, consumption) * 24 * 365).toFixed(2)
}

export {tariffPriceEasyMethod, calculateCostForTheFirstYear};
