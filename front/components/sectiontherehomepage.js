/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
import Image from "next/legacy/image";
import { SiGoogleplay, SiApple } from 'react-icons/si';
//import Image1 from "../public/img23.jpg";


const ContentThere = () => {
  return (
    <div className="flex flex-col space-y-12 items-center justify-center  w-full py-12">
      <div className="text-center space-y-3 ">
        <p className="text-xl font-medium text-amber-600">POURQUOI NOUS CHOISIR</p>
        <p className="text-4xl font-light text-gray-600">
        Fièrement au service de la région Djerba depuis 2023
        </p>
      </div>
      
      <div
  className="relative"
  style={{
    height: '700px', // Set the desired height
    width: '1600px', // Set the desired width
  }}
>
  <Image
    src="/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
    layout="fill"
    objectFit="cover"
    alt="Background Image"
    style={{ borderRadius: '30px' }}
  />

  <div
    className="text-container"
    style={{
      position: 'absolute',
      top: '50%',
      left: '30%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      textAlign: 'center',
    }}
  >
    <p className="text-white text-4xl font-bold">
    Tunisie Uber, Le Taxi Qui <br /> Répond Aux Attentes <br /> D’aujourd’hui
    </p>

    <div>
  <a href="#" className="button google-play">
    <SiGoogleplay className="button-icon" /> Google Play
  </a>{' '}
  <span style={{ margin: '0 30px' }}></span>
  <a href="#" className="button app-store">
    <SiApple className="button-icon" /> App Store
  </a>
</div>


  </div>

 <div
  className="absolute top-1/2 right-0 transform translate-x-2/2 -translate-y-2/4"
  style={{
    zIndex: 1,
    marginRight:'100px'
  }}
>
  <Image
    src="/imageapp.png"
    height={450} // Set the desired height of the top image
    width={360} // Set the desired width of the top image
    alt="Overlay Image"
    style={{ marginTop: "90px", }}
  />
</div>

</div>




    </div>
  );
};
export default ContentThere;
