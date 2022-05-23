
   

import { Hero } from "@components/ui/common"
import { CourseList, CourseCard } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllParkings } from "@content/courses/fetcher"

export default function Home({courses}) {
  return (
    <>
      <Hero />
      <CourseList
        courses={courses}
      >
      {course =>
        <CourseCard
          key={course.id}
          course={course}
        />
      }
      </CourseList>
    </>
  )
}

export function getStaticProps() {
  const { data } = getAllParkings()
  return {
    props: {
      courses: data
    }
  }
}

Home.Layout = BaseLayout