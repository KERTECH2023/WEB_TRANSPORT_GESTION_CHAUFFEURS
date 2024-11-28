/* eslint-disable jsx-a11y/alt-text */
import { FaHashtag } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Import required modules
import { Autoplay, Navigation } from "swiper";
import Link from "next/link";

const Contents = () => {
  return (
    <div className="container mx-auto py-12 space-y-16 w-full px-4 sm:px-8 lg:px-12">
      {/* Section Texte Principal */}
      <div className="text-center space-y-6">
        <FaHashtag className="w-12 h-12 text-amber-600 p-1 mx-auto" />
        <p className="text-lg sm:text-2xl lg:text-3xl font-light text-gray-600 leading-relaxed">
          Je vous invite à essayer notre service et je vous garantis personnellement que vous
          <br className="hidden sm:block" />
          aurez une expérience pleinement satisfaite.
        </p>
      </div>

      {/* Section avec Texte et Swiper */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Colonne Texte */}
        <div className="flex flex-col justify-center items-center text-center space-y-6 py-8 px-4 lg:px-0">
          <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-600">
            Service client exceptionnel
          </p>
          <p className="text-sm sm:text-lg lg:text-xl font-light text-gray-500 leading-relaxed">
            En offrant un service exceptionnel sans aucun détail sans surveillance, nous avons
            eu la chance d'être devenus le principal fournisseur de transports terrestres dans
            la région. Notre objectif est de rendre vos voyages sûrs, sans effort et dans les délais.
          </p>
          <Link href="/contact">
            <button
              type="button"
              className="text-white bg-amber-600 hover:bg-amber-800 rounded-3xl px-6 py-3 lg:px-8 lg:py-4"
            >
              CONTACTEZ-NOUS
            </button>
          </Link>
        </div>

        {/* Colonne Swiper */}
        <div className="mt-8 lg:mt-0 flex justify-center">
          <Swiper
            navigation={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Navigation]}
            className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] h-[300px] sm:h-[400px] lg:h-[500px]"
          >
            {/* Slides */}
            {["1.png", "5.png", "3.png", "7.png", "6.png", "2.png"].map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-full bg-no-repeat bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url(/${img})`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Contents;
