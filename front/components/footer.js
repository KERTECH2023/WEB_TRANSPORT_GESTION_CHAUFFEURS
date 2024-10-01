/* eslint-disable react/no-unescaped-entities */
import {
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaRegClock,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import Link from "next/link";

const footer = () => {
  return (
    <div>
      <div className="bg-gray-100 py-10 px-10">
        <div className="container mx-auto flex flex-col space-y-24 ">
          <div className="grid lg:grid-cols-3 gap-20">
            <div className="col-span-1 flex flex-row space-x-3">
              <FaMapMarkedAlt className="w-12 h-12 text-amber-600  p-1" />
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">ADRESSE</p>
                <p className="text-gray-600 font-medium text-xs">
                  39,rue 8301 Immeuble Safsaf bloc A N°2-5 Montplaisir 1073
                  Tunis.
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-row space-x-3">
              <FaPhoneAlt className="w-12 h-12 text-amber-600  p-1" />
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">N° Télephones</p>
                <p className="text-gray-600 font-medium text-xs">
                  RÉSERVER UN VOYAGE: (0481) 123 987 2411 <br />
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-row space-x-3">
              <FaRegClock className="w-12 h-12 text-amber-600  p-1" />
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">HEURES D'OUVERTURE</p>
                <p className="text-gray-600 font-medium text-xs">
                  LUNDI - SAMEDI : 07:00 - 17:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 container mx-10 flex flex-row justify-between">
        <p>Copyright 2023 par KerTechnologie</p>
        <div className="flex flex-row space-x-6">
          <Link href="/Politique">
            <h2
              href="/politique-confidentialite"
              className="hover:text-blue-600"
            >
              Politique de confidentialité
            </h2>
          </Link>
        </div>
        <div className="flex flex-row space-x-3 mr-24">
          <FaFacebook className="w-5 h-5 text-gray-500" />
          <FaInstagram className="w-5 h-5 text-gray-500" />
          <FaWhatsapp className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};
export default footer;
