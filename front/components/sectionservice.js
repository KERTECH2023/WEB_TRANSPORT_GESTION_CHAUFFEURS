/* eslint-disable react/no-unescaped-entities */
import {
  FaEnvira,
  FaCodepen,
  FaBusAlt,
  FaDrawPolygon,
  FaDollarSign,
} from "react-icons/fa";

const Service = () => {
  return (
    <div className="container lg:grid lg:grid-cols-8 gap-6 py-24 px-12 items-center place-content-center justify-center">
      <div className="col-span-2 flex flex-col  space-y-4 items-center justify-center text-center">
        <FaEnvira className="w-16 h-16 text-amber-600 bg-gray-100 rounded-full p-1" />
        <p className="text-2xl font-medium text-gray-600">
          La sécurité d'abord
        </p>
        <p className="text-gray-600">
          Personnel expérimenté et chauffeurs formés professionnellement
        </p>
      </div>
      <div className="col-span-2 flex flex-col space-y-4 items-center justify-center text-center">
        <FaDollarSign className="w-16 h-16 text-amber-600 bg-gray-100 rounded-full p-1" />
        <p className="text-2xl font-medium text-gray-600">
          Tarifs raisonnables
        </p>
        <p className="text-gray-600">
          Nous pouvons vous offrir le bon véhicule au bon prix pour s'adapter à
          votre budget
        </p>
      </div>
      <div className="col-span-2 flex flex-col space-y-4 items-center justify-center text-center">
        <FaDrawPolygon className="w-16 h-16  text-amber-600 bg-gray-100 rounded-full p-1" />
        <p className="text-2xl font-medium text-gray-600">PROFESSIONNEL</p>
        <p className="text-gray-600">
          Nos chauffeurs sont des professionnels autorisés, certifiés par la
          Wilaya avec un permis de confiance
        </p>
      </div>
      <div className="col-span-2 flex flex-col space-y-4 items-center justify-center text-center">
        <FaBusAlt className="w-16 h-16 text-amber-600 bg-gray-100 rounded-full p-1" />
        <p className="text-2xl font-medium text-gray-600">RAPIDE</p>
        <p className="w-72 text-gray-600">
          Google Maps intégré optimise vos trajets pour gagner du temps.
        </p>
      </div>
    </div>
  );
};
export default Service;
