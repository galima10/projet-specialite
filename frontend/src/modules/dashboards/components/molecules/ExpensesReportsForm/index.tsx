import styles from "./ExpensesReportForm.module.scss";
import { Dispatch, SetStateAction } from "react";
import {
  useExpensesReportsForm,
  useExportsFormHasFields,
  budget,
} from "@modules/dashboards/hooks/useExpensesReportsForm";
import type { Users } from "@stores/features/users";

export default function ExpensesReportsForm({
  setTab,
  userSelected,
}: {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
  userSelected?: Users | null;
}) {
  const {
    formData,
    setFormData,
    currentDocuments,
    currentExpense,
    setCurrentDocuments,
    setCurrentExpense,
    calculateTotals,
    removeExpense,
    handleDocumentChange,
    handleGeneratePdf,
    handleInputChange,
    handleSubmit,
    sendData,
    waiverMileageRates,
    kmMileageRates,
    setStep,
    step,
    handleAddExpense,
    handleValidateInfos,
  } = useExpensesReportsForm();
  const {
    totalAll,
    totalKm,
    totalKmAmount,
    totalTransportCost,
    totalOtherCost,
  } = calculateTotals();
  const {
    hasKm,
    hasOther,
    hasTransport,
    hasWaiver,
    setHasKm,
    setHasOther,
    setHasTransport,
    setHasWaiver,
  } = useExportsFormHasFields();

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
            <button onClick={handleValidateInfos}>Suivant</button>
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
            <button
              onClick={() => {
                if (formData.expensesList.length === 0) {
                  console.log("Il n'y a encore aucune dépense d'entrée");
                  return null;
                }
                setStep(3);
              }}
            >
              Suivant
            </button>
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
              <button type="button" onClick={handleAddExpense}>
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
            <button
              onClick={() => {
                setStep(1);
                setFormData({
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
                setTab("addReport");
                sendData(userSelected);
              }}
            >
              Valider
            </button>
          </div>
        </>
      ) : null}
    </form>
  );
}
