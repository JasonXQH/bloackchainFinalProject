
import { Modal, Button } from "@components/ui/common";
import { useEffect, useState } from "react";

import { useEthPrice } from "@components/hooks/useEthPrice";

import {PARKING_PRICE_PER_HOUR} from "@components/hooks/useEthPrice"
const defaultOrder = {
  hour: "",
  totalPrice: "",
}

const _createFormState = (isDisabled = false, message =  "") => ({isDisabled, message})

const createFormState = ({hour, totalPrice}) => {
  if (!totalPrice || Number(totalPrice) <= 0) {
    return _createFormState(true, "Price is not valid.")
  }
  return _createFormState()
}


export default function ReleaseModal({
    hour,
    totalPrice,
    number,
    mallName,
    mallString, 
    onClose,
    onSubmit}) {

  const [isOpen, setIsOpen] = useState(false)
  const [order, setOrder] = useState(defaultOrder)
  const { eth } = useEthPrice()
  const totalPriceMinusDeposit = totalPrice>0?totalPrice-PARKING_PRICE_PER_HOUR:0
  const totalETH =   (totalPriceMinusDeposit/eth.data).toFixed(10)
  useEffect(() => {
    if (!!number) {
      setIsOpen(true)
      setOrder({
        ...defaultOrder,
        number: number,
        mallString:mallString,
        hour: hour,
        totalPrice:totalETH
      })
    }
  }, [number])

  const closeModal = () => {
    setIsOpen(false)
    setOrder(defaultOrder)
    onClose()
  }

  const formState = createFormState(order)
  return (
    <Modal isOpen={isOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="mb-7 text-lg font-bold leading-6 text-gray-900" id="modal-title">
                释放 {mallName}
                mallNumber, {number} 号车位
              </h3>
              <div className="mt-1 relative rounded-md">
                <div className="mb-1">
                  <label className="mb-2 font-bold">已停时长</label>
                </div>
                <input
                 disabled={true}
                  value={`${hour} 小时`}
                  type="text"
                  name="hours"
                  id="hours"
                  className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-700">
                  Price will be verified at the time of the order. If the price will be lower, order can be declined (+- 2% slipage is allowed)
                </p>
              </div>
              <div className="mt-2 relative rounded-md">
                <div className="mb-1">
                  <label className="mb-2 font-bold">共需支付(已减去押金)</label>
                </div>
                <input
                  disabled={true}
                  value={`${totalPriceMinusDeposit} 元 , 约 ${totalETH} ETH`}
                  type="text"
                  name="totalPrice"
                  id="totalPrice"
                  className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
          <Button
              disabled={false}
              onClick={() => {
                setIsOpen(false)
                onSubmit(order)
            }}>
              Submit
          </Button>
          <Button
            onClick={closeModal}
            variant="red">
            Cancel
          </Button>
        </div>
    </div>
    </Modal>
  )
}