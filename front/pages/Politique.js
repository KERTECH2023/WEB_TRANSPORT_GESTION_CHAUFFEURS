import React from "react";

export default function Politique() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Politique de Confidentialité de l'Application FlashDriver
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Dernière mise à jour : 17/12/2024
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Cette politique de confidentialité décrit comment FlashDriver collecte, utilise et protège
            les informations personnelles que vous partagez lorsque vous utilisez notre application.
            Nous nous engageons à respecter votre vie privée et à protéger vos données conformément aux
            lois applicables, notamment le Règlement Général sur la Protection des Données (RGPD) et la loi
            sur la protection des données personnelles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Collecte de données</h2>
          <p className="text-gray-700 mb-4">Nous collectons plusieurs types d'informations lors de votre utilisation de notre application :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Informations personnelles :</strong> nom, prénom, adresse e-mail, numéro de téléphone, et informations de paiement.</li>
            <li><strong>Données de localisation :</strong> votre position géographique lors de l'utilisation du service.</li>
            <li><strong>Données d'utilisation :</strong> informations sur la façon dont vous interagissez avec l'application (par exemple, l'historique des trajets, les préférences de voyage).</li>
            <li><strong>Données de communication :</strong> toute communication que vous échangez avec le support client.</li>
            <li><strong>Localisation arrière-plan :</strong> information sur la localisation des chauffeurs en arrière-plan pour le bon fonctionnement de l’application.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Utilisation des données</h2>
          <p className="text-gray-700 mb-4">Les données collectées sont utilisées pour les finalités suivantes :</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Fournir les services : traiter vos demandes de transport, calculer le prix des trajets, vous géolocaliser et vous proposer un conducteur.</li>
            <li>Améliorer l'expérience utilisateur : personnaliser et améliorer nos services en fonction de vos préférences.</li>
            <li>Assurer la sécurité : prévenir la fraude, vérifier l'identité des utilisateurs et assurer la conformité avec nos conditions d'utilisation.</li>
            <li>Communications : vous envoyer des informations importantes sur votre compte, vos trajets, et les promotions spéciales.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Partage des données</h2>
          <p className="text-gray-700 mb-4">Nous ne vendons ni ne louons vos données personnelles. Cependant, nous pouvons partager vos informations dans les cas suivants :</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Avec des prestataires de services : pour traiter les paiements, fournir un support technique ou améliorer l'application.</li>
            <li>Avec des autorités légales : lorsque cela est nécessaire pour se conformer à la loi ou à des obligations légales.</li>
            <li>Avec d'autres utilisateurs : pour partager des informations essentielles à la réalisation d'un trajet, comme la position géographique du conducteur et de l'utilisateur.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Protection des données</h2>
          <p className="text-gray-700">
            Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles
            contre l'accès non autorisé, la modification, la divulgation ou la destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Vos droits</h2>
          <p className="text-gray-700 mb-4">Conformément à la législation sur la protection des données, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Droit d'accès :</strong> vous pouvez demander à accéder aux données personnelles que nous détenons à votre sujet.</li>
            <li><strong>Droit de rectification :</strong> vous pouvez demander la correction de toute information inexacte ou incomplète.</li>
            <li><strong>Droit à l'effacement :</strong> vous pouvez demander la suppression de vos données dans certaines situations.</li>
            <li><strong>Droit à la portabilité :</strong> vous pouvez demander à recevoir vos données dans un format structuré et couramment utilisé.</li>
            <li><strong>Droit d'opposition :</strong> vous pouvez vous opposer à l'utilisation de vos données pour certaines finalités, notamment à des fins de marketing.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Pour exercer ces droits, veuillez nous contacter à [adresse e-mail de contact].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Cookies</h2>
          <p className="text-gray-700">
            Nous utilisons des cookies et des technologies similaires pour améliorer l'expérience utilisateur et analyser l'utilisation de notre application.
            Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait affecter certaines fonctionnalités de l'application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Modification de la politique de confidentialité</h2>
          <p className="text-gray-700">
            Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de toute modification importante
            en publiant la nouvelle version sur cette page. La date de la dernière mise à jour sera indiquée en haut de cette page.
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

  );
}
