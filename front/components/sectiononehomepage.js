
/* eslint-disable jsx-a11y/alt-text */
import { FaHashtag } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper";
import Image from "next/legacy/image";
import Image1 from "../public/image_01-6.jpg";
import Image2 from "../public/image_01-5.jpg";
import Image3 from "../public/image_10-1.jpg";
import Image4 from "../public/image_10-2.jpg";
import Image5 from "../public/image_03-2.jpg";
import Link from "next/link";
const Contents = () => {
  return (
    <div className="container mx-auto py-24  space-y-20 w-full">
    
      <div className="px-12 flex flex-col justify-center items-center text-center space-y-6">
        <FaHashtag className="w-12 h-12 text-amber-600  p-1" />
        <p className="text-3xl font-light text-gray-600">
        Je vous invite à essayer notre service et je vous garantis personnellement que vous
          <br />
          avoir une expérience pleinement satisfaite.
        </p>
        {/* <p className="text-xl text-gray-500">Khaled Erjili - PRÉSIDENT PDG</p> */}
      </div>
      <div className="lg:grid lg:grid-cols-2 px-12">
        <div className="col-span-1 space-y-6 py-12 text-center px-8">
          <p className="text-3xl font-medium text-gray-600">
          Service client exceptionnel
          </p>
          <p className="text-2xl font-light text-gray-500">
          En offrant un service exceptionnel sans aucun détail sans surveillance, nous avons
            eu la chance d`être devenu le principal fournisseur de
            transports terrestres dans la région. Notre objectif est de rendre vos voyages
            sûr, sans effort et dans les délais.
          </p>
          <Link href="/contact">
                <button
                  type="button"
                  className="text-white  bg-amber-600 hover:bg-amber-800   rounded-3xl  px-8 py-3 text-center mr-2 mb-2 "
                  style={{ marginTop: '70px' }}
                >
                  CONTACTEZ-NOUS
                </button>
                </Link>

          
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ marginLeft: '70px'}}>
        <div className="col-span-1 row-span-2">
        <Swiper 
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        style={{ height: '500px', width: '100%',marginLeft: '160px' }} 
      >
         <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/1.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
    
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/5.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
    
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/3.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
    
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/7.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
    
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/6.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
    
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/2.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
           
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-screen bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(/5.png)`,
              height: '500px', // Specify the desired height
              width: '350px', // Specify the desired width
            }}
          >
            
          </div>
        </SwiperSlide>
      </Swiper>
          
  {/* <Image
    src="/Untitled1-removebg-preview.png"
    height={800} // Set the desired height
    width={550} // Set the desired width
    style={{ marginLeft: "80px" }}
    
  /> */}
</div>
          
        </div>
      </div>
    </div>
  );
};
export default Contents;
