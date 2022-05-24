
import { BookedParkingSpace } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { useAccount, useOwnedParkings } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { getAllParkings } from "@content/courses/fetcher";

export default function OwnedCourses({parkings}) {
  const { account } = useAccount()
  const { ownedParkings } = useOwnedParkings(parkings,account.data)
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