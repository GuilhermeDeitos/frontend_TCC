/*
  Card com título, descrição e botão
*/

interface CardProps{
  title: string;
  description: string;
  buttonText: string;
  link?: string;
}

export function Card({ title, description, buttonText, link }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex-grow">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4 text-justify">{description}</p>
      </div>
      <a href={link} className="mt-auto block">
      <button className="bg-blue-500 border-1 border-blue-500 text-white px-4 py-2 rounded w-full hover:bg-white hover:text-blue-500 transition-colors cursor-pointer">
        {buttonText}
      </button>
      </a>
    </div>
  );
}