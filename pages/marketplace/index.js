

import { ParkingCard, ParkingList } from "@components/ui/parking"
import { BaseLayout } from "@components/ui/layout"
import { getAllParkings } from "@content/courses/fetcher"
import { useWalletInfo } from "@components/hooks/web3"
import { Button } from "@components/ui/common"
import { MarketHeader } from "@components/ui/marketplace"
import Link from "next/link"
export default function Marketplace({parkings}) {

  const { account, network, canPurchaseCourse } = useWalletInfo()

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <ParkingList
        parkings={parkings}
      >
        
      {parking =>
        <ParkingCard
          key={parking.id}
          parking={parking}
          disabled={!canPurchaseCourse}
          Footer={() =>
            <div className="mt-4">
              <Link href={`/parkings/${parking.slug}`}>
              <Button  
                variant="lightPurple"
                disabled={!canPurchaseCourse}
                >
                去预定！
              </Button>
          </Link>
            </div>
          }
        />
      }
      </ParkingList>
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

Marketplace.Layout = BaseLayout