

import { useEthPrice, PARKING_PRICE_PER_HOUR  } from "@components/hooks/useEthPrice"
import { Loader } from "@components/ui/common"
import Image from "next/image"
export default function EthRates() {
  const { eth } = useEthPrice()


    return (
      <div className="flex flex-col xs:flex-row text-center">
      <div className="p-6 border drop-shadow rounded-md mr-2">
        <div className="flex items-center justify-center">
          { eth.data ?
            <>
              <Image
                layout="fixed"
                height="35"
                width="35"
                src="/small-eth.webp"
              />
              <span className="text-2xl font-bold">
                = {eth.data}$
              </span>
            </> :
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          }
          </div>
          <p className="text-lg text-gray-500">Current eth Price</p>
        </div>
        <div className="p-6 border drop-shadow rounded-md">
          <div className="flex items-center justify-center">
                { eth.data ?
                  <>
                    <span className="text-2xl font-bold">
                      {eth.perItem}
                    </span>
                    <Image
                      layout="fixed"
                      height="35"
                      width="35"
                      src="/small-eth.webp"
                    />
                    <span className="text-2xl font-bold">
                      = {PARKING_PRICE_PER_HOUR}￥
                    </span>
                  </> :
                  <div className="w-full flex justify-center">
                    <Loader size="md" />
                  </div>
                }
           
          </div>
          <p className="text-xl text-gray-500">参考每小时停车价格</p>
        </div>

        <div className="p-6 border drop-shadow rounded-md">
          <div className="flex items-center justify-center">
                {
                  eth.usdNum?
                  <>
                    <span className="text-2xl font-bold">
                        1$ = {eth.usdNum} ￥
                    </span>
                  </> :
                  <div className="w-full flex justify-center">
                    <Loader size="md" />
                  </div>
                }
          </div>
          <p className="text-xl text-gray-500">人民币-美元汇率</p>
        </div>
      </div>
    )
  }