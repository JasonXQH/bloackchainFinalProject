
   

import { Hero } from "@components/ui/common"
import { ParkingList, ParkingCard } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllParkings } from "@content/courses/fetcher"

export default function Home({parkings}) {
  return (
    <>
      <Hero />
      <ParkingList
        parkings={parkings}
      >
      {parking =>
        <ParkingCard
          key={parking.id}
          parking={parking}
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

Home.Layout = BaseLayout