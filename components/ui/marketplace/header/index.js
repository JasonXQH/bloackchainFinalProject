
import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";

const LINKS = [{
  href: "/marketplace",
  value: "主页"
}, {
  href: "/marketplace/courses/owned",
  value: "我的预定"
}, {
  href: "/marketplace/courses/manage",
  value: "管理车位"
}]

export default function Header() {
  return (
    <>
       <div className="pt-4">
        <WalletBar />
      </div>
      <EthRates />
      <div className="flex flex-row-reverse p-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={LINKS} />
      </div>
    </>
  )
}