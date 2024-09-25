import React from "react";
import styles from "./templatefacture.module.css";
import logo from "../../assests/logowhite.png";

const TemplateFacture = ({ chauffeur, facture }) => {
  let montantPaye = facture.totalFareAmount * 0.15;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.infoschauff}>
          <h2 className={styles.NomChauff}>
            {chauffeur
              ? `${chauffeur.Nom} ${chauffeur.Prenom}`
              : "Nom du Chauffeur"}
          </h2>
          <p className={styles.AdresseF}>
            {chauffeur ? chauffeur.address : "Adresse"}
          </p>
        </div>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Informations Facture */}
      <div className={styles.invoiceInfo}>
        <p className={styles.invoiceInfoF}>
          Facture N°: {facture ? facture.invoiceNumber : ""}
        </p>
        <p className={styles.invoiceInfoD}>
          Date:{" "}
          {facture
            ? `${facture.Month} - ${facture.Year}`
            : "[Date de la facture]"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className={styles.invoiceTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Désignation</th>
              <th>Nombre de Trajets</th>
              <th>Montant Total ( TTC )</th>
              <th> Service Client</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {}
            <tr>
              <td>
                {facture
                  ? `Facture de Mois :   ${facture.Month} - ${facture.Year} `
                  : " - "}
              </td>
              <td>{facture ? facture.nbretrajet : " - "}</td>
              <td>
                {facture
                  ? parseFloat(facture.totalFareAmount).toFixed(2) + " dt"
                  : " - "}
              </td>
              <td>
                {facture ? parseFloat(montantPaye).toFixed(2) + " dt" : " - "}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.total}>
        <p>
          Total à payer:{" "}
          {facture ? parseFloat(montantPaye).toFixed(2) + " dt" : " - "}
        </p>
      </div>

      {/* Ligne et message de politesse */}
      <div className={styles.footer}>
        <hr className={styles.separator} />
        <p className={styles.politesse}>
          Merci pour votre confiance. Si vous avez des questions, n'hésitez pas
          à nous contacter.
        </p>
      </div>
    </div>
  );
};

export default TemplateFacture;
