
import useSWR from "swr"

const Web3Utils = require('web3-utils');
const PARK_STATES = {
    0: "Booked",
    1: "Available",
  }
export const handler = (web3, contract) => (parkings, account) => {
    var normaledALLParkings = []
    const swrRes = useSWR(() =>
      (web3 && contract && account) ? "web3/ownedParkings/${account}" : null,

      async () => {
        const parkingPool = await contract.methods.getParkingPool().call()

        
        for(let i = 0;i< parkingPool.length;i++){
            const parking = parkingPool[i]
            var parkNumber = Web3Utils.hexToUtf8(parking.parkNumber)
            var mallid = parseInt(parkNumber.substring(0,2))
            var location = parkNumber.substring(2)
            var normal = {
                mallid: mallid,
                location: location,
                owner: parking.owner, 
                state: PARK_STATES[parseInt(parking.state)]
              } 
            normaledALLParkings.push(normal)
        }
        // if(n)
        return normaledALLParkings
      }
    )
  
    return swrRes
}