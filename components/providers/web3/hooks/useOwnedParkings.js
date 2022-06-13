
import useSWR from "swr"
const Web3Utils = require('web3-utils');

export const PARK_STATES = {
  0: "Booked",
  1: "Available",
}

export const MALL_NUMBER = {
  1: "K11地下停车场",
  2: "环球港地下停车场",
  3: "环贸地下停车场",
  4: "来福士环贸停车场"
}

export const handler = (web3, contract) => (parkings, account) => {
    const swrRes = useSWR(() =>
      (web3 && contract && account) ? "web3/ownedParkings/${account}" : null,
      async () => {
        const ownedParkings = await contract.methods.getOwnedParkList().call()
        const normaledOwnedParkings = []
        for (let i = 0; i < ownedParkings.length; i++) {
          var parking = ownedParkings[i]
          if(parking.owner!=account){continue}
          var parkNumber = Web3Utils.hexToUtf8(parking.parkNumber)
          var mallName = MALL_NUMBER[parseInt(parkNumber.substring(0,2))]
          var location = parkNumber.substring(2)
          var timeing_hour =  (Math.round(((new Date()).getTime() / 1000)-parking.startTimeStamp)/3600).toFixed(2);
          var days  = Math.floor(timeing_hour/24)
          var hours = timeing_hour%24
          console.log("days:"+days)
          var hour_price = hours >10 ? 150 : Math.round(timeing_hour)*15
          var day_price  = days*150
          var cumulative_cost = day_price + hour_price
          var normal = {
            mallNumber: parseInt(parkNumber.substring(0,2)),
            mallString: parkNumber.substring(0,2),
            mallName: mallName,
            location: location,
            owner: parking.owner, 
            deposit: web3.utils.fromWei(parking.price),
            proof: parking.proof,
            timeing_hour : timeing_hour,
            cumulative_cost: cumulative_cost,
            state: PARK_STATES[parseInt(parking.state)]
          }
          normaledOwnedParkings.push(normal)
        }
        return normaledOwnedParkings
      }
    )
  
    return swrRes
}