

import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { EthRates, WalletBar } from "@components/ui/web3"
import { useWalletInfo } from "@components/hooks/web3"
import { useEthPrice } from "@components/hooks/useEthPrice"
import { Button } from "@components/ui/common"

import { MarketHeader } from "@components/ui/marketplace"
import Link from "next/link"
export default function Marketplace({courses}) {

  const { account, network, canPurchaseCourse } = useWalletInfo()
  const { eth } = useEthPrice()


  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <CourseList
        courses={courses}
      >
        
      {course =>
        <CourseCard
          key={course.id}
          course={course}
          disabled={!canPurchaseCourse}
          Footer={() =>
            <div className="mt-4">
              <Link href={`/courses/${course.slug}`}>
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
      </CourseList>
    </>
  )
}

export function getStaticProps() {
  const { data } = getAllCourses()
  return {
    props: {
      courses: data
    }
  }
}

Marketplace.Layout = BaseLayout