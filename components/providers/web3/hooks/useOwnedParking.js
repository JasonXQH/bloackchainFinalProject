

import useSWR from "swr"

const Web3Utils = require('web3-utils');
export const PARK_STATES = {
  0: "Booked",
  1: "Available",
}
export const handler = (web3, contract) => (parkNumber, account) => {
  const swrRes = useSWR(() =>
    (web3 && contract && account) ? `web3/ownedParking/${account}` : null,
    async () => {

      var hexParkNumber = Web3Utils.utf8ToHex(parkNumber)
      /*
      parkNumber : 01A001
      hexParkNumber : 0x30324130303100000000000000000000
      address: 0x661b48edf3D9443BEf4C6b4f477B8475031A8d3b
      输出:5d1d2b78a60fe2ab0b3d6df8826fb9cadb67bf343496be38352bf4c16160fbc1
      */
      const parkHash = Web3Utils.soliditySha3(
        { type: "bytes16", value: hexParkNumber },
        { type: "address", value: account }
      )
      
      const ownedParking = await contract.methods.getParkByHash(parkHash).call()
      // console.log(ownedParking)

      if (ownedParking.owner === "0x0000000000000000000000000000000000000000") {
        return null
      }

      /*
      id: "0"
      owner: "0x661b48edf3D9443BEf4C6b4f477B8475031A8d3b"
      parkNumber: "0x30324130303100000000000000000000"
      price: "1078000000000000"
      proof: "0x7b2fb444a5ed72c757bcadce2f5c7c50a60231dc9eec9e02e4ccfd39bfd7eda9"
      startTimeStamp: "1653320681"
      state: "0"
      valid: true
      */ 
      return  { 
        parkNumber: parkNumber,
        owner: ownedParking.owner, 
        proof: ownedParking.proof,
        state: PARK_STATES[parseInt(ownedParking.state)]
      }
    }
  )

  return swrRes
}