import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0x7a62ed033a19de3227e0d41e503922fc02e8271aef89bae3359b2540783d0ff9": true
}

export const handler = (web3, provider) => () => {

  const { data, mutate, ...rest } = useSWR(() =>
    web3 ? "web3/accounts" : null,
    async () => {
      const accounts = await web3.eth.getAccounts()
      return accounts[0]
    }
  )

  useEffect(() => {
    provider &&
    provider.on("accountsChanged",
      accounts => mutate(accounts[0] ?? null)
    )
  }, [provider])


  return {
      data,
      isAdmin: (
        data &&
        adminAddresses[web3.utils.keccak256(data)]) ?? false,
      mutate,
      ...rest
  }
}