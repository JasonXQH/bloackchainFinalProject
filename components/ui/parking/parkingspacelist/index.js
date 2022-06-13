
import { Button } from "@components/ui/common"
import { useState } from "react"
import { OrderModal } from "@components/ui/order"
import { useWeb3 } from "@components/providers"

import { useWalletInfo,useParkingPool } from "@components/hooks/web3";
const Web3Utils = require('web3-utils');

const PARK_STATES = {
   "Booked": "bg-red-100 text-red-800",
   "Available":"bg-green-100 text-green-800"
}
export default function  ParkingSpaceList({locked,mall,parkings}) {
  
  const { web3, contract } = useWeb3() 
  const { account } = useWalletInfo()
  const [selectedNumber, setSelectedNumber] = useState(null)
  const { parkingPool } = useParkingPool(parkings,account.data)
  
  var parkNumber = mall.id+selectedNumber
  var afterFiltered = parkingPool.data? parkingPool.data.filter(ob=>ob.mallid==mall.id):undefined
// location: "A001"
// mallid: 1
// owner: "0x55d1492fc00938Be60DC896B02a055f23f415A43"
// state: "Available"
// for(let i = 0;i<mall.space_list.length;i++){
//   var parkNumber =  mall.id+mall.space_list[i]
//   const { ownedParking } =  useOwnedParking(parkNumber,account.data)
//   console.log(ownedParking.data?"找到了!"+ownedParking.data.parkNumber+"owner"+ownedParking.data.owner:undefined)
//   continue
// }
  const bookParking = async order => {
    const hexParkId =Web3Utils.utf8ToHex(parkNumber)
    // exp: hexParkId: 0x303141303033

    const orderHash = Web3Utils.soliditySha3(
      { type: "bytes16", value: hexParkId },
      { type: "address", value: account.data }
    )
    //exp: orderHash: 0x69727cdf4ff195ddcad27393074a330e73c42d5c5ef179107470ba4192aa9bb7

    const phoneNumberHash = Web3Utils.sha3(order.number)
    //exp: phoneNumberHash:
    //0x3aa7a097b84fc66f6269a952b87ed1ad459e0a39f909be0964c7eeaed75290dc
    const proof = Web3Utils.soliditySha3(
      { type: "bytes32", value: phoneNumberHash },
      { type: "bytes32", value: orderHash }
    )

    //exp : proof: 
    //0x90fd23b6329891f2f47829f3abecc037fa103e06c39a4b811e537cf7b9a83888
    const value = web3.utils.toWei(String(order.price))

    try {
      const result =  contract.methods.bookPark(
        hexParkId,
        proof
      ).send({from: account.data, value})
    } catch {
      console.error("Purchase course: Operation has failed.")
    }
  }

  const statusClass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section 1
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  { afterFiltered?.map(ob =>
                    <tr key={ob.location}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {ob.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`${PARK_STATES[ob.state]} ${statusClass}`}
                        >
                          {ob.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 
                      {ob.state=="Booked"&&ob.owner==account.data ?
                       <>
                       <Button
                       onClick={()=>window.open("/marketplace/parkings/owned","_self")}
                      variant="purple">
                        Yours
                      </Button>
                       </> :
                       ob.state=="Booked"?
                       <>
                       <Button
                       disabled={true}
                      variant="red">
                        Others
                      </Button>
                      </> :
                      <Button
                      onClick={() => setSelectedNumber(ob.location)}
                      variant="lightPurple">
                        Book
                      </Button>
                      }
                    </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      { selectedNumber &&
        <OrderModal
          number={selectedNumber}
          mall = {mall.title}
          onSubmit={bookParking}
          onClose={() => setSelectedNumber(null)}
        />
      }
    </section>
  )
}
 