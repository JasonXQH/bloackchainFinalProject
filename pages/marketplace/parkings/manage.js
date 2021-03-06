
import {ParkingSpaceFilter, BookedParkingSpace } from "@components/ui/parking";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { Button } from "@components/ui/common"

export default function ManageCourses() {

  return (
    <>
      <div className="py-4">
        <MarketHeader />
        <ParkingSpaceFilter />
      </div>
      <section className="grid grid-cols-1">
        <BookedParkingSpace>
          <div className="flex mr-2 relative rounded-md">
            <input
              type="text"
              name="account"
              id="account"
              className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
              placeholder="0x2341ab..." />
            <Button>
              Verify
            </Button>
          </div>
        </BookedParkingSpace>
      </section>
    </>
  )
}

ManageCourses.Layout = BaseLayout