

interface BlueTitleCardProps {
  title: string;
  subtitle: string;
}

export function BlueTitleCard({
  title,
  subtitle
}: BlueTitleCardProps){
  return (

    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20 mb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
  )
}