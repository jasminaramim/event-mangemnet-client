import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const speakers = [
  {
    name: 'Vick Robel',
    role: 'Chief Disrupter at Un',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: 'bg-rose-500'
  },
  {
    name: 'Steven Addis',
    role: 'CEO at addis',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    color: 'bg-green-700'
  },
  {
    name: 'Sandra Aamodt',
    role: 'CEO at addis',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    color: 'bg-cyan-500'
  },
  {
    name: 'Mosh Hamedani',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    color: 'bg-gray-500'
  },
  {
    name: 'Mike Addis',
    role: 'CEO at Amazon',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
    color: 'bg-pink-500'
  },
  {
    name: 'Marc Abrahams',
    role: 'Editor at Improbable',
    image: 'https://randomuser.me/api/portraits/women/46.jpg',
    color: 'bg-green-500'
  },
  {
    name: 'Leyla Acaroglu',
    role: 'CEO at addis',
    image: 'https://randomuser.me/api/portraits/men/47.jpg',
    color: 'bg-yellow-500'
  },
  {
    name: 'John Duo',
    role: 'Producer',
    image: 'https://randomuser.me/api/portraits/men/48.jpg',
    color: 'bg-orange-600'
  }
];

const PopularSpeakers = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h4 className="text-pink-600 font-bold mb-2 text-xl">Speaker</h4>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10">Popular Speakers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-all duration-300 flex flex-col items-center"
            >
              <div
                className={`rounded-full p-1 mb-4 ${speaker.color} overflow-hidden w-24 h-24`}
              >
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{speaker.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{speaker.role}</p>
              <div className="flex gap-3 text-gray-600">
                <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
                <FaTwitter className="hover:text-sky-400 cursor-pointer" />
                <FaLinkedinIn className="hover:text-blue-800 cursor-pointer" />
                <FaInstagram className="hover:text-pink-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSpeakers;
