
import { BookedParkingSpace } from "@components/ui/parking";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { useAccount, useOwnedParkings,useWalletInfo} from "@components/hooks/web3";
import { Button } from "@components/ui/common";
import { getAllParkings } from "@content/courses/fetcher";
import { useState } from "react"
import { useWeb3 } from "@components/providers"
import { ReleaseModal } from "@components/ui/order"
const Web3Utils = require('web3-utils');


export default function OwnedCourses({parkings}) {
  const { account } = useAccount()
  const { ownedParkings } = useOwnedParkings(parkings,account.data)
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [mallTitle, setMallTitle] = useState(null)
  const [mallString,setMallString] = useState(null)
  const [hour, setHour] = useState(null)
  const [totalPrice, setTotalPrice] = useState(null)
  const { web3, contract } = useWeb3() 
  const releaseParking = async order => {
    const hexParkId =Web3Utils.utf8ToHex(order.mallString+order.number)
    console.log(hexParkId)
    // exp: hexParkId: 0x303141303033
    const value = Web3Utils.toWei(String(order.totalPrice))
    console.log("totalValue: "+value)
    try {
      const result =  contract.methods.releasePark(
        hexParkId,
      ).send({from: account.data, value})
    } catch {
      console.error("Release parking: Operation has failed.")
    }
  }

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        { ownedParkings.data?.map(parking =>
          <BookedParkingSpace
            key = {parking.mallName}
            parking={parking}
          >
            <Button 
             onClick={() => {
               setSelectedNumber(parking.location)
               setMallTitle(parkings[parking.mallNumber-1].title)
               setHour(parking.timeing_hour)
               setMallString(parking.mallString)
               setTotalPrice(parking.cumulative_cost)
            }}
            >
              释放停车位
            </Button>
            <span>   </span>
            <Button 
            slug={parking}
            onClick={()=>window.open(`/courses/${ parkings[parking.mallNumber-1].slug}`,"_self")}>
              查看车库状态
            </Button>
          </BookedParkingSpace>
        )}
        { selectedNumber &&
        <ReleaseModal
          hour = {hour}
          totalPrice = {totalPrice}
          number={selectedNumber}
          mallString={mallString}
          mallName = {mallTitle}
          onSubmit={releaseParking}
          onClose={() => setSelectedNumber(null)}
        />
      }
      </section>
    </>
  )
}
export function getStaticProps() {
  const { data } = getAllParkings()
  return {
    props: {
      parkings: data
    }
  }
}

OwnedCourses.Layout = BaseLayout