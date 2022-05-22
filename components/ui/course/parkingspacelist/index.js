
import { Button } from "@components/ui/common"
import { useState } from "react"
import { OrderModal } from "@components/ui/order"
const space_list = [
  "A001",
  "A002",
  "A003",
  "A004",
  "A005",
  "A006",
  "A007",
  "A008",
  "A009",
]

export default function ParkingSpaceList({locked,title}) {
const [selectedNumber, setSelectedNumber] = useState(null)

const purchaseCourse = (order) => {
  alert(JSON.stringify(order))
}

  const statusClass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section 1
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  { space_list.map(number =>
                    <tr key={number}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={
                            locked ?
                             `bg-red-100 text-red-800 ${statusClass}` :
                             `bg-green-100 text-green-800 ${statusClass}`
                          }
                        >
                          { locked ? "Booked" : "Available" }

                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 
                        <div className="mt-1">
                        <Button
                          onClick={() => setSelectedNumber(number)}
                          variant="lightPurple">
                          { locked ? "Release" : "Book" }
                          </Button>
                        </div>
                    </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      { selectedNumber &&
        <OrderModal
          number={selectedNumber}
          mall = {title}
          onSubmit={purchaseCourse}
          onClose={() => setSelectedNumber(null)}
        />
      }
    </section>
  )
}


