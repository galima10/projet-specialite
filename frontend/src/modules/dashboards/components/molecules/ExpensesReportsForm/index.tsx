import styles from "./ExpensesReportForm.module.scss";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";

import type { ExpensesReport } from "@stores/features/expensesReports";
import type { Users } from "@stores/features/users";
import { createExpensesReportThunk } from "@stores/thunks/expensesReports";
import { fetchMileageRatesThunk } from "@stores/thunks/mileages";

const budget = [
  {
    name: "Administratif",
    value: "ADMINISTRATIVE",
  },
  {
    name: "Bibliothèque",
    value: "LIBRARY",
  },
  {
    name: "Matos Explo / Spéléo / Canyon",
    value: "EXPEDITION_EQUIPEMENT",
  },
  {
    name: "Matos autre",
    value: "OTHER_EQUIPEMENT",
  },
  {
    name: "Week-ends et sorties",
    value: "WEEKENDS_OUTINGS",
  },
];

export default function ExpensesReportsForm({
  setTab,
  userSelected,
}: {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
  userSelected?: Users | null;
}) {
  const [hasKm, setHasKm] = useState(false);
  const [hasTransport, setHasTransport] = useState(false);
  const [hasOther, setHasOther] = useState(false);
  const [hasWaiver, setHasWaiver] = useState(false);
  const disptach = useAppDispatch();
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
    otherCost: 0,
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
    reportDocumentFile: null,
    expensesList: [],
    userIBAN: "",
    userBIC: "",
  });
  useEffect(() => {
    disptach(fetchMileageRatesThunk());
  }, []);
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
  }
  function sendData(userSelected: Users | null = null) {
    console.log(formData);
    // if (
    //   !formData.reason ||
    //   !formData.budget ||
    //   !formData.amountWaiver ||
    //   !formData.expensesList
    // ) {
    //   console.log("manque de champs");
    //   return null;
    // }

    let userId: number, kmMileageRateId: number, waiverMileageRateId: number;
    if (currentUser.role === "ROLE_ADMIN") {
      if (userSelected) userId = userSelected.id;
      else userId = currentUser.id;
    } else {
      userId = currentUser.id;
    }

    if (formData.kmMileageRate && kmMileageRates.length !== 0) {
      kmMileageRateId = kmMileageRates.find(
        (km) => km.label === formData.kmMileageRate,
      ).id;
    }

    if (formData.waiverMileageRate && waiverMileageRates.length !== 0) {
      waiverMileageRateId = waiverMileageRates.find(
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
      reportDocumentFile: formData.reportDocumentFile,
      expensesList: formData.expensesList,
    };

    console.log(userId);

    disptach(createExpensesReportThunk({ data: request, userId: userId }));

    console.log(request);
  }

  function removeExpense(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      expensesList: prev.expensesList.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  }

  function calculateTotals() {
    const totalKm = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.km || 0),
      0,
    );

    const rate = kmMileageRates.find(
      (rate) => rate.label === formData.kmMileageRate,
    );

    const totalKmAmount = rate ? totalKm * rate.amountPerKm : 0;

    const totalTransportCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.transportCost || 0),
      0,
    );

    const totalOtherCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.othersCost || 0),
      0,
    );

    const totalAll = totalKmAmount + totalTransportCost + totalOtherCost;

    return {
      totalAll,
      totalKm,
      totalKmAmount,
      totalTransportCost,
      totalOtherCost,
    };
  }
  const {
    totalAll,
    totalKm,
    totalKmAmount,
    totalTransportCost,
    totalOtherCost,
  } = calculateTotals();

  function generateHtml() {
    // --- Totaux ---
    const totalKm = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.km || 0),
      0,
    );

    const rate = kmMileageRates.find(
      (rate) => rate.label === formData.kmMileageRate,
    );

    const totalKmAmount = rate ? totalKm * rate.amountPerKm : 0;

    const totalTransportCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.transportCost || 0),
      0,
    );

    const totalOtherCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.othersCost || 0),
      0,
    );

    const totalAll = totalKmAmount + totalTransportCost + totalOtherCost;

    // --- Justificatifs HTML ---
    const expensesRows = formData.expensesList
      .map(
        (exp) => `
    <tr>
      <td>${exp.date}</td>
      <td>${exp.object}</td>
      <td>${exp.km}</td>
      <td>${exp.transportCost} €</td>
      <td>${exp.othersCost} €</td>
    </tr>
  `,
      )
      .join("");

    // --- Frais d'abandon ---
    let realAmountWaiver = 0;
    if (formData.waiverMileageRate) {
      const waiverRate = waiverMileageRates.find(
        (r) => r.label === formData.waiverMileageRate,
      );
      realAmountWaiver = waiverRate
        ? totalKm * waiverRate.amountPerKm * (1 - 0.66)
        : 0;
    }

    // --- Génération HTML ---
    return `
  <div style="padding:20px;font-family:Arial">
    <h1>Note de frais</h1>

    <h3>Informations</h3>
    <p><strong>Nom:</strong> ${formData.userName}</p>
    <p><strong>Date demande:</strong> ${formData.createdAt}</p>
    <p><strong>Motif:</strong> ${formData.reason}</p>
    <p><strong>Budget:</strong> ${budget.find((b) => b.value === formData.budget).name}</p>

    <h3>Dépenses</h3>
    <table border="1" cellspacing="0" cellpadding="5" width="100%">
      <thead>
        <tr>
          <th>Date</th>
          <th>Objet</th>
          <th>Km</th>
          <th>Transport</th>
          <th>Autres</th>
        </tr>
      </thead>
      <tbody>
        ${expensesRows}
      </tbody>
    </table>

    <h3>Totaux</h3>
    <ul>
      <li>Total km : ${totalKm}</li>
      <li>Total frais km : ${totalKmAmount.toFixed(2)} €</li>
      <li>Total frais transport : ${totalTransportCost.toFixed(2)} €</li>
      <li>Total autres frais : ${totalOtherCost.toFixed(2)} €</li>
      <li>Total général : ${totalAll.toFixed(2)} €</li>
    </ul>

    ${
      formData.waiverMileageRate
        ? `
      <h3>Frais d'abandon</h3>
      <p>Barème choisi : ${formData.waiverMileageRate}</p>
      <p>Après déduction d’impôts, le montant réel dépensé sera de : ${realAmountWaiver.toFixed(2)} €</p>
    `
        : ""
    }

    <h3>Coordonnées bancaires</h3>
    <p>IBAN: ${formData.userIBAN}</p>
    <p>BIC: ${formData.userBIC}</p>
  </div>
  `;
  }

  async function handleGeneratePdf() {
    const element = document.createElement("div");
    element.innerHTML = generateHtml();

    const opt = {
      margin: 10,
      filename: "note-de-frais.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const pdfBlob = await window
      .html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob");

    const pdfFile = new File([pdfBlob], "note-de-frais.pdf", {
      type: "application/pdf",
    });

    formData.reportDocumentFile = pdfFile;

    window.html2pdf().set(opt).from(element).save();
  }
  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  return (
    <form onSubmit={handleSubmit}>
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
              {budget.map((item, index) => {
                return (
                  <option key={`budget-${index}`} value={item.value}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.nextPrevButton}>
            <button onClick={() => setTab("home")}>Annuler</button>
            <button onClick={() => setStep(2)}>Suivant</button>
          </div>
        </>
      ) : step === 2 ? (
        <>
          <button
            onClick={() => {
              setHasKm(false);
              setHasTransport(false);
              setHasOther(false);
              setStep(2.5);
            }}
          >
            Ajouter une dépense
          </button>
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
                  </ul>
                  <button onClick={() => removeExpense(indexItem)}>
                    Supprimer la dépense
                  </button>
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
                <input
                  id="expenseHasKm"
                  type="checkbox"
                  checked={hasKm}
                  onChange={(e) => setHasKm(e.target.checked)}
                />
              </div>
              {hasKm && (
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
              )}
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <label htmlFor="expenseHasKm">
                  des coûts de péages ou autres transports ?
                </label>
                <input
                  id="expenseHasTransport"
                  type="checkbox"
                  checked={hasTransport}
                  onChange={(e) => setHasTransport(e.target.checked)}
                />
              </div>
              {hasTransport && (
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
              )}
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <label htmlFor="expenseHasOther">d'autres coûts ?</label>
                <input
                  id="expenseHasOther"
                  type="checkbox"
                  checked={hasOther}
                  onChange={(e) => setHasOther(e.target.checked)}
                />
              </div>
              {hasOther && (
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
              )}
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
                    otherCost: 0,
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
            <li>Total des frais : {totalAll.toFixed(2)} €</li>

            {totalKm > 0 && (
              <li>
                Total de km : {totalKm}
                {totalKmAmount > 0 &&
                  ` - Total des frais de km : ${totalKmAmount.toFixed(2)} €`}
              </li>
            )}

            {totalTransportCost > 0 && (
              <li>
                Total de frais de transport : {totalTransportCost.toFixed(2)} €
              </li>
            )}

            {totalOtherCost > 0 && (
              <li>Total des autres frais : {totalOtherCost.toFixed(2)} €</li>
            )}
          </ul>
          {formData.expensesList.some((item) => item.km && item.km > 0) && (
            <>
              <div className={styles.input}>
                <label htmlFor="kmMileageRate">Votre condition</label>
                <select
                  name="kmMileageRate"
                  id="kmMileageRate"
                  onChange={handleInputChange}
                >
                  <option value="">--Choisissez une option--</option>
                  {kmMileageRates.map((item, index) => (
                    <option key={`kmRate-${index}`} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <p>Abandon de frais</p>
              <div className={styles.inputContainer}>
                <div className={styles.checkbox}>
                  <label htmlFor="expenseHasWaiver">
                    Je souhaite faire un abandon de frais
                  </label>
                  <input
                    id="expenseHasWaiver"
                    type="checkbox"
                    checked={hasWaiver}
                    onChange={(e) => setHasWaiver(e.target.checked)}
                  />
                </div>
                {hasWaiver && (
                  <>
                    <div className={styles.input}>
                      <label htmlFor="amountWaiver">De la somme de :</label>
                      <input
                        id="amountWaiver"
                        type="number"
                        name="amountWaiver"
                        placeholder="Entrez la somme abandonnée ici"
                        onChange={handleInputChange}
                        defaultValue={0}
                        min={0}
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
                        {waiverMileageRates.map((item, index) => {
                          return (
                            <option key={`wvRate-${index}`} value={item.label}>
                              {item.label}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {formData.waiverMileageRate &&
                      (() => {
                        // Total km parcourus
                        const totalKm = formData.expensesList.reduce(
                          (sum, item) => sum + Number(item.km || 0),
                          0,
                        );

                        // Trouver le barème choisi pour l'abandon
                        const rate = waiverMileageRates.find(
                          (r) => r.label === formData.waiverMileageRate,
                        );

                        // Calcul du montant avant impôt
                        const totalAmount = rate
                          ? totalKm * rate.amountPerKm
                          : 0;

                        // Après déduction fiscale (66%)
                        const realAmount = totalAmount * (1 - 0.66);

                        return (
                          <p>
                            Après déduction d'impôts, le montant réel dépensé
                            sera de : {realAmount.toFixed(2)} €
                          </p>
                        );
                      })()}
                  </>
                )}
              </div>
            </>
          )}

          <p>Remboursement</p>
          <p>
            Je souhaite que le CST me rembourse :{" "}
            {totalAll.toFixed(2) - Number(formData.amountWaiver || 0)}
          </p>
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
            <button
              onClick={() => {
                handleGeneratePdf();
                setStep(4);
              }}
            >
              Générer le PDF
            </button>
          </div>
        </>
      ) : step === 4 ? (
        <>
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
            <button onClick={() => sendData(userSelected)}>Valider</button>
          </div>
        </>
      ) : null}
    </form>
  );
}
