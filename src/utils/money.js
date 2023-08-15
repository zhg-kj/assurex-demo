function centsToDollars(cents) {
  const dollars = cents / 100;
  return dollars.toFixed(2);
}

function dollarsToCents(dollars) {
  const cents = dollars * 100;
  return Math.floor(cents);
}

function centsToXRP(cents) {
  const xrpRate = 0.65; // 1 XRP = $0.65
  const dollars = cents / 100;
  const xrp = dollars / xrpRate;
  return xrp.toFixed(6); 
}

module.exports = { centsToDollars, dollarsToCents, centsToXRP };