import { Modal } from "@components/ui/common";
import {
  CourseHero,
  ParkingSpaceList,
  Tips
} from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllParkings } from "@content/courses/fetcher";

export default  function Course({parking,data}) {
  return (
    <>
      <div className="py-4">
        <CourseHero
          title={parking.title}
          description={parking.description}
          image={parking.coverImage}
        />
      </div>
      <Tips
        points={parking.wsl}
      />
      <ParkingSpaceList
        locked={false}
        mall={parking}
        parkings = {data}
      />
      <Modal />
    </>
  )
}

export function getStaticPaths() {
  const { data } = getAllParkings()

  return {
    paths: data.map(c => ({
      params: {
        slug: c.slug
      }
    })),
    fallback: false
  }
}


export function getStaticProps({params}) {
  const { data } = getAllParkings()
  const parking = data.filter(c => c.slug === params.slug)[0]

  return {
    props: {
      parking,
      data
    }
  }
}

Course.Layout = BaseLayout