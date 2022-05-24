import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0xf7088e181ff4ec2fed5c50c025d105f5a869253fccde2d4f7581e3324044e1c8": true
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