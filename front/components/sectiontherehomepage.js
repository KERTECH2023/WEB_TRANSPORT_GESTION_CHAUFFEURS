/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
import Image from "next/legacy/image";
import { SiGoogleplay, SiApple } from "react-icons/si";

const ContentThere = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 space-y-12 bg-gray-100">
      {/* Titre */}
      <div className="text-center space-y-3">
        <p className="text-lg sm:text-xl font-medium text-amber-600">
          POURQUOI NOUS CHOISIR
        </p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-600">
          Fièrement au service de la région Djerba depuis 2023
        </p>
      </div>

      {/* Section avec image et contenu */}
      <div className="relative w-full max-w-7xl mx-auto h-[250px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
        {/* Image de fond */}
        <Image
          src="/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
          layout="fill"
          objectFit="cover"
          alt="Background Image"
          className="rounded-xl"
        />

        {/* Contenu superposé */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 space-y-6 z-10">
          <p className="text-white text-lg sm:text-xl lg:text-3xl font-bold">
            Tunisie Uber, Le Taxi Qui <br /> Répond Aux Attentes <br /> D’aujourd’hui
          </p>
          {/* Boutons pour télécharger l'application */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="#"
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800"
            >
              <SiGoogleplay />
              <span className="text-sm sm:text-base">Google Play</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800"
            >
              <SiApple />
              <span className="text-sm sm:text-base">App Store</span>
            </a>
          </div>
        </div>

        {/* Image secondaire */}
        <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 z-0 hidden sm:block">
          <Image
            src="/imageapp.png"
            height={250} // Hauteur ajustée
            width={200} // Largeur ajustée
            alt="Overlay Image"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentThere;
