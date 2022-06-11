import { EXCHANGE_RATE_API_KEY as apiKey } from "../api.js";

const ratesBox = document.querySelectorAll(".rates-box");
const selectBox = document.querySelectorAll("#select");
const getBtn = document.querySelector("#form button");
const fromCurrency = document.querySelector(".from-box select");
const toCurrency = document.querySelector(".to-box select");

for (let i = 0; i < ratesBox.length; i++) {
  for (let props in countries) {
    const currency_code = countries[props].toUpperCase();

    let options = `<option value="${currency_code}">${currency_code}</option>`;
    selectBox.forEach((box) => {
      box.insertAdjacentHTML("beforeend", options);
    });
  }

  selectBox.forEach((box) => {
    box.addEventListener("change", (e) => {
      loadFlag(e.target);
    });
  });
}

function loadFlag(el) {
  for (let props in countries) {
    const currency_code = countries[props].toUpperCase();
    if (currency_code === el.value) {
      let imgTag = el.parentElement.querySelector("img"); // selecting img tag of a particular drop list
      imgTag.src = `https://flagcdn.com/${props}.svg`;  // passing country code of a selected currency code in an img tag
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const icon = document.querySelector(".icon");
icon.addEventListener("click", () => {
  //swapping currency value
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("#amount");
  const exchangeTxt = document.querySelector(".output");

  let amountValue = amount.value;
  //If no value is inputted, set the default value to 1
  if (amountValue == "" || amountValue == "0" || isNaN(amountValue)) {
    amount.value = "1";
    amountValue = 1;
  }

  exchangeTxt.innerText = "Fetching exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let exchangeRate = data.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountValue * exchangeRate).toFixed(3);
      exchangeTxt.innerText = `${amountValue} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeTxt.innerText = "Something went wrong";
    });
}
