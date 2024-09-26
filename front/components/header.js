import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper";
const header = () => {
  return (
    <div className=" h-[27em] w-full -mb-8">
      <Swiper
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
      >
        <SwiperSlide>
          <div
            className="h-[27em] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/img01.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-[27em] bg-black bg-opacity-10 ">
              <div className="h-[27em] flex flex-col justify-center items-center space-y-6">
                <p className="text-7xl text-white ">
                  {" "}
                  Votre voyage, notre passion
                </p>
                <p className="text-2xl font-light text-white ">
                  Commandez un taxi en un clic depuis votre mobile
                </p>

                <Link href="/Conducteur">
                  <button
                    type="button"
                    className="text-white  bg-amber-600 hover:bg-amber-800   rounded-3xl  px-8 py-3 text-center mr-2 mb-2 "
                  >
                    Devenir Conducteur
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-[27em] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/img02.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-[27em] bg-black bg-opacity-10 ">
              <div className="h-[27em] flex flex-col justify-center items-center space-y-6">
                <p className="text-7xl text-white ">
                  {" "}
                  Votre voyage, notre passion
                </p>
                <p className="text-2xl font-light text-white ">
                  Commandez un taxi en un clic depuis votre mobile
                </p>
                <Link href="/Conducteur">
                  <button
                    type="button"
                    className="text-white  bg-amber-600 hover:bg-amber-800   rounded-3xl  px-8 py-3 text-center mr-2 mb-2 "
                  >
                    Devenir Conducteur
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-[27em] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/img11.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "",
            }}
          >
            <div className="h-[27em] bg-black bg-opacity-10 ">
              <div className="h-[27em] flex flex-col justify-center items-center space-y-6">
                <p className="text-7xl text-white ">
                  {" "}
                  Votre voyage, notre passion
                </p>
                <p className="text-2xl font-light text-white ">
                  Commandez un taxi en un clic depuis votre mobile
                </p>
                <Link href="/Conducteur">
                  <button
                    type="button"
                    className="text-white  bg-amber-600 hover:bg-amber-800   rounded-3xl  px-8 py-3 text-center mr-2 mb-2 "
                  >
                    Devenir Conducteur
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default header;
