
export default function List({parkings, children}) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      { parkings.map(parking => children(parking))}
    </section>
  )
}