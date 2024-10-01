import React from "react";

export default function Politique() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Politique de Confidentialité
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Dernière mise à jour : 01/10/2024
        </p>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Chez <strong>KerTechnologie</strong>, nous nous engageons à protéger
          la vie privée de nos utilisateurs et à gérer leurs données
          personnelles avec la plus grande attention. Cette politique de
          confidentialité explique comment nous collectons, utilisons et
          protégeons vos informations personnelles.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Informations que nous collectons
            </h2>
            <p className="text-gray-700 mb-4">
              Nous pouvons collecter les types d'informations suivants :
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Informations d'identification personnelle :</strong>{" "}
                nom, adresse, e-mail, numéro de téléphone, etc.
              </li>
              <li>
                <strong>Informations techniques :</strong> adresse IP, type de
                navigateur, pages visitées, heure et date de votre visite, etc.
              </li>
              <li>
                <strong>Données de communication :</strong> messages échangés
                via nos plateformes, formulaires de contact, etc.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Utilisation des données
            </h2>
            <p className="text-gray-700 mb-4">
              Nous utilisons vos informations pour :
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Fournir et gérer nos services.</li>
              <li>Améliorer notre site web et notre service client.</li>
              <li>
                Vous envoyer des informations et des mises à jour sur nos
                produits.
              </li>
              <li>Répondre à vos questions et demandes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Partage des données
            </h2>
            <p className="text-gray-700 mb-4">
              Nous ne partageons pas vos données personnelles avec des tiers,
              sauf :
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Si cela est nécessaire pour fournir nos services (par exemple,
                prestataires de services).
              </li>
              <li>Si la loi l'exige ou pour protéger nos droits.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Sécurité des données
            </h2>
            <p className="text-gray-700">
              Nous mettons en place des mesures de sécurité appropriées pour
              protéger vos informations personnelles contre toute perte, vol ou
              accès non autorisé. Cependant, aucune méthode de transmission sur
              Internet ou méthode de stockage électronique n'est totalement
              sécurisée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Vos droits
            </h2>
            <p className="text-gray-700 mb-4">
              Vous avez les droits suivants concernant vos données personnelles
              :
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Droit d'accès :</strong> vous pouvez demander une copie
                de vos données personnelles que nous détenons.
              </li>
              <li>
                <strong>Droit de rectification :</strong> vous pouvez demander
                la correction de vos données inexactes.
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> vous pouvez demander la
                suppression de vos données sous certaines conditions.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Cookies
            </h2>
            <p className="text-gray-700">
              Nous utilisons des cookies pour améliorer votre expérience sur
              notre site. Les cookies sont de petits fichiers stockés sur votre
              appareil. Vous pouvez gérer vos préférences de cookies dans les
              paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Modifications de cette politique
            </h2>
            <p className="text-gray-700">
              Nous nous réservons le droit de modifier cette politique de
              confidentialité. Toute modification sera publiée sur cette page
              avec une date de mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Contact
            </h2>
            <p className="text-gray-700 mb-3">
              Pour toute question ou demande concernant cette politique de
              confidentialité, veuillez nous contacter à :
            </p>
            <ul className="ml-4 list-disc list-inside text-gray-700">
              <li>
                <strong>KerTechnologie</strong>
              </li>
              <li>CyberParc Djerba</li>
              <li>
                <a
                  href="mailto:contact@kertechnologie.fr"
                  className="text-blue-500 underline"
                >
                  contact@kertechnologie.fr
                </a>
              </li>
              <li>+33 7 63 22 33 50</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
