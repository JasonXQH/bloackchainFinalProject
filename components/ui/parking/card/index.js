
import Image from "next/image"
import Link from "next/link"

export default function Card({parking,  disabled ,Footer}) {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex h-full">
        <div className="flex h-full">
          <Image
            className={`object-cover ${disabled && "filter grayscale"}`}
            src={parking.coverImage}
            layout="fixed"
            width="200"
            height="230"
            alt={parking.title}
          />
        </div>
        <div className="p-8">
          <div
            className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {parking.type}
          </div>
          <Link href={parking.link}>
            <a
              target="_blank" 
              className="block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline">
              {parking.title}
            </a>
          </Link>
          <p
            className="mt-2 text-sm sm:text-base text-gray-500">
            {parking.description}
          </p>
          { Footer &&
            <Footer />
          }
        </div>
      </div>
    </div>
  )
}