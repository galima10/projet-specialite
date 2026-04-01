import styles from "./ExpensesReportForm.module.scss";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useAppSelector } from "@modules/shared/hooks/redux";

import type { ExpensesReport } from "@stores/features/expensesReports";
import type { Users } from "@stores/features/users";

export default function ExpensesReportsForm({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
}) {
  const { currentUser, users } = useAppSelector((state) => state.user);
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  const [step, setStep] = useState<number>(1);
  const [currentExpense, setCurrentExpense] = useState({
    date: "",
    object: "",
    km: 0,
    transportCost: 0,
    othersCost: 0,
    documents: null,
  });
  const [currentDocuments, setCurrentDocuments] = useState<
    { name: string; preview: string; file: File }[]
  >([]);
  const [formData, setFormData] = useState({
    dateRequest: "",
    userName: "",
    createdAt: new Date().toISOString(),
    reason: "",
    budget: "",
    amountWaiver: 0,
    waiverMileageRate: null,
    kmMileageRate: null,
    reportDocumentPath: null,
    expensesList: [],
    userIBAN: "",
    userBic: "",
  });
  useEffect(() => {
    console.log("FormData mis à jour :", formData);
  }, [formData]);
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isExpense = false,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value, type } = target;

    const checked =
      type === "checkbox" ? (target as HTMLInputElement).checked : undefined;
    const files =
      type === "file" ? (target as HTMLInputElement).files : undefined;

    if (isExpense) {
      setCurrentExpense((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? (files?.[0] ?? null)
              : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }
  function handleDocumentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentDocuments((prev) => [
      ...prev,
      {
        name: file.name,
        preview: URL.createObjectURL(file),
        file: file,
      },
    ]);
  }
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (currentUser.role === "ROLE_ADMIN") {
      if (users.length !== 0) {
        let userId = users.find((u) => (u.name = formData.userName)).id;
      }
    }
  }

  async function generatePdf() {
    const html = `
    <html><head><script src=\"https:\/\/cdn.tailwindcss.com\"><\/script><\/head><body class=\"h-screen grid place-items-center\"><span class=\"print:hidden\">IT SHOULD NO BE PRINTED<\/span><div class=\"bg-pink-300 text-pink-800 p-8 h-[100px] grid place-items-center font-medium font-mono\">@mathieutu<\/div><\/body><\/html>
  `;

    const response = await fetch("https://pdf.mathieutu.dev/api/gen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        filename: "report.pdf",
        html,
        merge: [], // tu peux mettre des URLs de PDF à fusionner
      }),
    });

    const blob = await response.blob();
    // télécharger le PDF côté frontend
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function handleGeneratePdf() {
    let kmMileageRateId: number, waiverMileageRateId: number;

    if (kmMileageRates.length !== 0) {
      kmMileageRateId = kmMileageRates.find(
        (km) => km.label === formData.kmMileageRate,
      ).id;
    }

    if (waiverMileageRates.length !== 0) {
      waiverMileageRateId = kmMileageRates.find(
        (wv) => wv.label === formData.waiverMileageRate,
      ).id;
    }

    const request: ExpensesReport = {
      createdAt: formData.createdAt,
      reason: formData.reason,
      budget: formData.budget,
      amountWaiver: formData.amountWaiver,
      waiverMileageRateId: waiverMileageRateId,
      kmMileageRateId: kmMileageRateId,
      reportDocumentPath: null,
      expensesList: formData.expensesList,
    };
  }
  return (
    <form action="" onSubmit={handleSubmit}>
      <button onClick={generatePdf}>Test pdf</button>
      {step === 1 ? (
        <>
          <div className={styles.input}>
            <label htmlFor="userName">Nom du demandeur</label>
            <input
              id="userName"
              type="text"
              placeholder="Entrez un nom..."
              name="userName"
              onChange={handleInputChange}
            />
          </div>
          <div className={`${styles.input} disabled`}>
            <label htmlFor="dateRequest">Date de la demande</label>
            <input
              id="dateRequest"
              type="text"
              defaultValue={formData.createdAt.split("T")[0]}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="reasonRequest">Raison de la demande</label>
            <input
              id="reasonRequest"
              type="text"
              placeholder="ex : WE Ardèche 02/2022 etc"
              name="reason"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="budgetRequest">Budget</label>
            <select
              name="budget"
              id="budgetRequest"
              onChange={handleInputChange}
            >
              <option value="">--Choisissez une option--</option>
            </select>
          </div>
          <div className={styles.nextPrevButton}>
            <button onClick={() => setTab("home")}>Annuler</button>
            <button onClick={() => setStep(2)}>Suivant</button>
          </div>
        </>
      ) : step === 2 ? (
        <>
          <button onClick={() => setStep(2.5)}>Ajouter une dépense</button>
          <ul>
            {formData.expensesList.map((item, indexItem) => {
              return (
                <li key={`listItem${indexItem}`}>
                  <ul>
                    <li>{item.date}</li>
                    <li>{item.object}</li>
                    <li>{item.km}</li>
                    <li>{item.transportCost}</li>
                    <li>{item.othersCost}</li>
                    {/* <li>
                      <ul>
                        {item.documents.map((doc) => {
                          <li>{doc.name}</li>;
                        })}
                      </ul>
                    </li> */}
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className={styles.nextPrevButton}>
            <button onClick={() => setStep(1)}>Retour</button>
            <button onClick={() => setStep(3)}>Suivant</button>
          </div>
        </>
      ) : step === 2.5 ? (
        <>
          <button onClick={() => setStep(2)}>Retour</button>
          <div className={styles.input}>
            <label htmlFor="expenseDate">Date de la dépense</label>
            <input
              id="expenseDate"
              type="date"
              placeholder="Choisissez une date"
              name="date"
              onChange={(e) => handleInputChange(e, true)}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="expenseObject">Objet de la dépense</label>
            <input
              id="expenseObject"
              type="text"
              placeholder="Entrez l'objet de la dépense"
              name="object"
              onChange={(e) => handleInputChange(e, true)}
            />
          </div>
          <div>
            <p>Ajouter :</p>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <label htmlFor="expenseHasKm">des kilomètres ?</label>
                <input id="expenseHasKm" type="checkbox" />
              </div>
              <div className={styles.input}>
                <label htmlFor="expenseKm">Nombre de kilomètres</label>
                <input
                  id="expenseKm"
                  type="number"
                  placeholder="Entrez le nombre de km parcouru"
                  name="km"
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <label htmlFor="expenseHasKm">
                  des coûts de péages ou autres transports ?
                </label>
                <input id="expenseHasTransport" type="checkbox" />
              </div>
              <div className={styles.input}>
                <label htmlFor="expenseTransport">Coût de transport</label>
                <input
                  id="expenseTransport"
                  type="number"
                  placeholder="Entrez le coût ici"
                  name="transportCost"
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <label htmlFor="expenseHasOther">d'autres coûts ?</label>
                <input id="expenseHasOther" type="checkbox" />
              </div>
              <div className={styles.input}>
                <label htmlFor="expenseOther">Autres coûts</label>
                <input
                  id="expenseOther"
                  type="number"
                  placeholder="Entrez le coût ici"
                  name="othersCost"
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
            </div>
            <div className={styles.fileContainer}>
              {currentDocuments.map((doc, index) => (
                <div key={index} className={styles.input}>
                  <img src={doc.preview ?? ""} alt={doc.name} />
                  <p>{doc.name}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentDocuments((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Supprimer
                  </button>
                </div>
              ))}

              <div className={styles.input}>
                <label htmlFor="expenseDocument">
                  Ajouter des justificatifs
                </label>
                <input
                  id="expenseDocument"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleDocumentChange}
                />
              </div>
            </div>
            <div className={styles.nextPrevButton}>
              <button
                type="button"
                onClick={() => {
                  const finalExpense = {
                    ...currentExpense,
                    documents: currentDocuments,
                  };

                  setFormData((prev) => ({
                    ...prev,
                    expensesList: [...prev.expensesList, finalExpense],
                  }));
                  setCurrentExpense({
                    date: "",
                    object: "",
                    km: 0,
                    transportCost: 0,
                    othersCost: 0,
                    documents: [],
                  });
                  setCurrentDocuments([]);
                  setStep(2);
                }}
              >
                Ajouter la dépense
              </button>
            </div>
          </div>
        </>
      ) : step === 3 ? (
        <>
          <ul>
            <li>Total des frais</li>
            <li>Total de km</li>
            <li>Total des frais de km</li>
            <li>Total des coûts de transport</li>
            <li>Total des autres coûts</li>
          </ul>
          <div className={styles.input}>
            <label htmlFor="kmMileageRate">Votre condition</label>
            <select
              name="kmMileageRate"
              id="kmMileageRate"
              onChange={handleInputChange}
            >
              <option value="">--Choisissez une option--</option>
            </select>
          </div>
          <p>Abandon de frais</p>
          <div className={styles.inputContainer}>
            <div className={styles.checkbox}>
              <label htmlFor="expenseHasWaiver">
                Je souhaite faire un abandon de frais
              </label>
              <input id="expenseHasWaiver" type="checkbox" />
            </div>
            <div className={styles.input}>
              <label htmlFor="amountWaiver">De la somme de :</label>
              <input
                id="amountWaiver"
                type="number"
                name="amountWaiver"
                placeholder="Entrez la somme abandonnée ici"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="waiverMileageRate">Votre condition</label>
              <select
                name="waiverMileageRate"
                id="waiverMileageRate"
                onChange={handleInputChange}
              >
                <option value="">--Choisissez une option--</option>
              </select>
            </div>
            <p>
              Après déduction d'impôts, le montant réel dépensé sera de : 0.00
            </p>
          </div>
          <p>Remboursement</p>
          <p>Je souhaite que le CST me rembourse : 0.00</p>
          <p>Sur le compte</p>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <label htmlFor="userIBAN">IBAN :</label>
              <input
                id="userIBAN"
                type="string"
                placeholder="Entrez votre IBAN"
                name="userIBAN"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="userBIC">BIC :</label>
              <input
                id="userBIC"
                type="string"
                placeholder="Entrez votre BIC"
                name="userBIC"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.nextPrevButton}>
            <button onClick={() => setStep(2)}>Retour</button>
            <button onClick={() => setStep(4)}>Générer le PDF</button>
          </div>
        </>
      ) : step === 4 ? (
        <>
          <button>Télécharger votre PDF</button>
          <p>
            Voulez-vous l'envoyer directement à l'association à l'adresse mail
            suivante : adressemail@gmail.com
          </p>
          <div className={styles.radio}>
            <label htmlFor="userGetFile">
              Oui
              <input
                id="userGetFile"
                name="userFile"
                type="radio"
                defaultChecked
              />
            </label>
            <label htmlFor="userWaiverFile">
              Non
              <input id="userWaiverFile" name="userFile" type="radio" />
            </label>
          </div>
          <div className={styles.nextPrevButton}>
            <button onClick={() => setStep(3)}>Retour</button>
            <button>Valider</button>
          </div>
        </>
      ) : null}
    </form>
  );
}
