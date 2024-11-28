import Logoo from "../public/logowhite.png";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper";

const Header = () => {
  return (
    <div className="h-[27em] w-full -mb-8">
      <Swiper
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div
            className="h-[27em] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/img01.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-[27em] bg-black bg-opacity-10">
              <div className="h-full flex flex-col justify-center items-center space-y-6 px-4 text-center">
                <p className="text-4xl md:text-7xl text-white font-bold">
                  Votre voyage, notre passion
                </p>
                <p className="text-lg md:text-2xl font-light text-white">
                  Commandez un taxi en un clic depuis votre mobile
                </p>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Link href="/Conducteur">
                    <button
                      type="button"
                      className="text-white bg-amber-600 hover:bg-amber-800 rounded-3xl px-8 py-3"
                    >
                      Devenir Conducteur
                    </button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <p className="text-white text-lg md:text-xl">
                      Télécharger notre application FlashDriver
                    </p>
                    <Image src={Logoo} alt="Logo FlashDriver" width={40} height={40} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Repeat similar structure for other slides */}
        <SwiperSlide>
          <div
            className="h-[27em] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/img02.jpg)`,
            }}
          >
            <div className="h-full bg-black bg-opacity-10">
              <div className="h-full flex flex-col justify-center items-center space-y-6 px-4 text-center">
                <p className="text-4xl md:text-7xl text-white font-bold">
                  Votre voyage, notre passion
                </p>
                <p className="text-lg md:text-2xl font-light text-white">
                  Commandez un taxi en un clic depuis votre mobile
                </p>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Link href="/Conducteur">
                    <button
                      type="button"
                      className="text-white bg-amber-600 hover:bg-amber-800 rounded-3xl px-8 py-3"
                    >
                      Devenir Conducteur
                    </button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <p className="text-white text-lg md:text-xl">
                      Télécharger notre application FlashDriver
                    </p>
                    <Image src={Logoo} alt="Logo FlashDriver" width={40} height={40} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Header;
