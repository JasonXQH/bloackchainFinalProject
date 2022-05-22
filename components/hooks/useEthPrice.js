import useSWR from "swr"

const api = "https://api.exchangerate-api.com/v4/latest/USD";
const URL = "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
var USD_to_CNY = 0
function fetchCurrencies() {
    const primary = "USD";
    const secondary = "CNY";
    const amount = 1;
    // Important: Include your API key below
    fetch(api)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("NETWORK RESPONSE ERROR");
        }
      })
      .then((data) => {
        USD_to_CNY =  data.rates.CNY
      })
      .catch((error) => console.error("FETCH ERROR:", error));
  }
export const PARKING_PRICE_PER_HOUR = 15

fetchCurrencies()
const fetcher = async url => {
  const res = await fetch(url)
  const json = await res.json()
  return json.market_data.current_price.usd ?? null
}

export const useEthPrice = () => {
  const { data, ...rest } = useSWR(
    URL,
    fetcher,
    { refreshInterval: 10000 }
  )

  const perItem = (data && (PARKING_PRICE_PER_HOUR /( USD_to_CNY*Number(data))).toFixed(6)) ?? null
  const usdNum = USD_to_CNY
  return { eth: { data, perItem,usdNum, ...rest}}
}