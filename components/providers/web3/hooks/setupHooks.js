import { handler as createAccountHook } from "./useAccount";
import { handler as createNetworkHook } from "./useNetwork";
import { handler as createOwnedParkingsHook } from "./useOwnedParkings"
import { handler as createOwnedParkingHook } from "./useOwnedParking"
import {handler as createParkingPool } from "./useParkingPool"
export const setupHooks = ({web3, provider, contract}) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider),
    useOwnedParkings: createOwnedParkingsHook(web3, contract),
    useOwnedParking: createOwnedParkingHook(web3, contract),
    useParkingPool: createParkingPool(web3, contract),
  }
}