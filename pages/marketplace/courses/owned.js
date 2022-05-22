
import { BookedParkingSpace } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";

import { Button, Message } from "@components/ui/common";

export default function OwnedCourses() {

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        <BookedParkingSpace>
          <Message>
            My custom message!
          </Message>
          <Button>
            Watch the course
          </Button>
        </BookedParkingSpace>
      </section>
    </>
  )
}

OwnedCourses.Layout = BaseLayout