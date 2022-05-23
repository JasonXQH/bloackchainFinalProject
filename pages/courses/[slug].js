import { Modal } from "@components/ui/common";
import {
  CourseHero,
  ParkingSpaceList,
  Tips
} from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllParkings } from "@content/courses/fetcher";

export default function Course({course}) {
  return (
    <>
      <div className="py-4">
        <CourseHero
          title={course.title}
          description={course.description}
          image={course.coverImage}
        />
      </div>
      <Tips
        points={course.wsl}
      />
      <ParkingSpaceList
        locked={false}
        mall={course}
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
  const course = data.filter(c => c.slug === params.slug)[0]

  return {
    props: {
      course
    }
  }
}

Course.Layout = BaseLayout