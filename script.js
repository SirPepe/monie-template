// Maps currency codes (eg. "EUR") to an object containing a currencies' name
// (eg. "Euro") and symbol (eg. "€"). See https://tinyurl.com/jsmapdocs
// for more information on maps.
const currencies = new Map([
  [ "AUD", { name: "Australian dollar", symbol: "A$" } ],
  [ "BGN", { name: "Bulgarian lev", symbol: "лв" } ],
  [ "BRL", { name: "Brazilian real", symbol: "R$" } ],
  [ "CAD", { name: "Canadian dollar", symbol: "C$" } ],
  [ "CHF", { name: "Swiss franc", symbol: "Fr" } ],
  [ "CNY", { name: "Chinese yuan", symbol: "元" } ],
  [ "CZK", { name: "Czech koruna", symbol: "Kč" } ],
  [ "DKK", { name: "Danish krone", symbol: "kr." } ],
  [ "EUR", { name: "Euro", symbol: "€" } ],
  [ "GBP", { name: "Pound sterling", symbol: "£" } ],
  [ "HKD", { name: "Hong Kong dollar", symbol: "HK$" } ],
  [ "HRK", { name: "Croatian kuna", symbol: "kn" } ],
  [ "HUF", { name: "Hungarian forint", symbol: "Ft" } ],
  [ "IDR", { name: "Indonesian rupiah", symbol: "Rp" } ],
  [ "ILS", { name: "Israeli new shekel", symbol: "₪" } ],
  [ "INR", { name: "Indian rupee", symbol: "₹" } ],
  [ "JPY", { name: "Japanese yen", symbol: "¥" } ],
  [ "KRW", { name: "South Korean won", symbol: "₩" } ],
  [ "MXN", { name: "Mexican peso", symbol: "Mex$" } ],
  [ "MYR", { name: "Malaysian ringgit", symbol: "RM" } ],
  [ "NOK", { name: "Norwegian krone", symbol: "kr" } ],
  [ "NZD", { name: "New Zealand dollar", symbol: "$" } ],
  [ "PHP", { name: "Philippine peso", symbol: "₱" } ],
  [ "PLN", { name: "Polish złoty", symbol: "zł" } ],
  [ "RON", { name: "Romanian leu", symbol: "L" } ],
  [ "RUB", { name: "Russian ruble", symbol: "₽" } ],
  [ "SEK", { name: "Swedish krona", symbol: "kr" } ],
  [ "SGD", { name: "Singapore dollar", symbol: "S$" } ],
  [ "THB", { name: "Thai baht", symbol: "฿" } ],
  [ "TRY", { name: "Turkish lira", symbol: "₺" } ],
  [ "USD", { name: "United States dollar", symbol: "$" } ],
  [ "ZAR", { name: "South African rand", symbol: "R" } ],
]);


// The currency data comes from the European Central Bank and only contains
// exchange rates relative to the euro. Use this function to get the rate from
// one any currency to any another
const convertRelative = (rates, from, to, base = "EUR") => {
  if (to === base && from === base) {
    return 1;
  } else {
    if (to === base) {
      return 1 / rates[from];
    } else if (from === base) {
      return rates[to];
    } else {
      return rates[to] / rates[from];
    }
  }
}


// DOM elements
const hamburgerButton      = document.querySelector(".header__hamburger a");
const swStatus             = document.querySelector(".swstatus");
const overlay              = document.querySelector(".overlay");
const travelCurrencyInput  = document.querySelector(".currency__select--travel");
const homeCurrencyInput    = document.querySelector(".currency__select--home");
const travelAmountInput    = document.querySelector(".amount__input--travel");
const travelCurrencyOutput = document.querySelector(".amount__currency--travel");
const homeAmountOutput     = document.querySelector(".amount__output--home");
const homeCurrencyOutput   = document.querySelector(".amount__currency--home");
const refreshButton        = document.querySelector(".refresh");
const notificationCheckbox = document.querySelector(".notifications");


// Create option elements for the select elements from the currencies
const createOptionElements = (currencies) => {
  return Array.from(currencies, ([ code, { name } ]) => {
    const element = document.createElement("option");
    element.innerHTML = `${name} (${code})`;
    element.value = code;
    return element;
  });
}


// Populate select elements
travelCurrencyInput.append(...createOptionElements(currencies));
homeCurrencyInput.append(...createOptionElements(currencies));


// Handle sidebar and hamburger

let sidebarOpened = false;

const openSidebar = () => {
  document.body.classList.add("sidebarOpened");
  hamburgerButton.innerText = "✕";
  sidebarOpened = true;
}

const closeSidebar = () => {
  document.body.classList.remove("sidebarOpened");
  hamburgerButton.innerText = "≡";
  sidebarOpened = false;
}

hamburgerButton.addEventListener("click", () => {
  (sidebarOpened) ? closeSidebar() : openSidebar();
});

overlay.addEventListener("click", () => {
  (sidebarOpened) ? closeSidebar() : null;
});

// Detect either the absence of the service worker API or a web page that's not
// served from a secure or local origin
if (!window.navigator.serviceWorker || !window.navigator.serviceWorker.ready) {
  const { host, protocol } = window.location;
  const reason = (host.startsWith("localhost") === false || protocol !== "https:")
    ? `The web page is not secure or served from a non-localhost origin.`
    : `You appear to be using an ancient browser.`;
  throw new Error(`Service Worker API non-functional! ${ reason }`);
}


// =======================================================
// Your code goes here! (and maybe into a service worker?)
// =======================================================

