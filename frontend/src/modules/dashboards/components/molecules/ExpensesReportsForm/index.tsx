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
    contact,
    setCurrentDocuments,
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
    handleSendPdf,
  } = useExpensesReportsForm(userSelected);
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
            <button className="secondary" onClick={() => setTab("home")}>
              Annuler
            </button>
            <button className="primary" onClick={handleValidateInfos}>
              Suivant
            </button>
          </div>
        </>
      ) : step === 2 ? (
        <>
          <button
            className={`primary ${styles.addExpense}`}
            onClick={() => {
              setHasKm(false);
              setHasTransport(false);
              setHasOther(false);
              setStep(2.5);
            }}
          >
            Ajouter une dépense
          </button>
          <ul className={styles.expenses}>
            {formData.expensesList.map((item, indexItem) => {
              return (
                <li key={`listItem${indexItem}`}>
                  <ul>
                    <li>
                      <strong>
                        n°{indexItem} - {item.date}
                        {item.object}
                      </strong>
                    </li>
                    <li>
                      Km : {item.km} - Frais de transport : {item.transportCost}{" "}
                      - Autres frais : {item.othersCost}
                    </li>
                    <button
                      className="tertiary"
                      onClick={() => removeExpense(indexItem)}
                    >
                      Supprimer la dépense
                    </button>
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className={styles.nextPrevButton}>
            <button className="secondary" onClick={() => setStep(1)}>
              Retour
            </button>
            <button
              className="primary"
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
            <h5 style={{ marginTop: "2rem" }}>Ajouter :</h5>
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
                    step="0.01"
                    name="km"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*([.,]\d{0,2})?$/.test(value) || value === "") {
                        handleInputChange(e, true);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        e.target.value = value.toFixed(2);
                      }
                    }}
                    defaultValue={0}
                    min={0}
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
                    step="0.01"
                    placeholder="Entrez le coût ici"
                    name="transportCost"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*([.,]\d{0,2})?$/.test(value) || value === "") {
                        handleInputChange(e, true);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        e.target.value = value.toFixed(2);
                      }
                    }}
                    defaultValue={0}
                    min={0}
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
                    step="0.01"
                    placeholder="Entrez le coût ici"
                    name="othersCost"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*([.,]\d{0,2})?$/.test(value) || value === "") {
                        handleInputChange(e, true);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        e.target.value = value.toFixed(2);
                      }
                    }}
                    defaultValue={0}
                    min={0}
                  />
                </div>
              )}
            </div>
            <div className={styles.fileContainer}>
              {currentDocuments.map((doc, index) => (
                <div key={index} className={styles.input}>
                  <img src={doc.preview ?? ""} alt={doc.name} />
                  <p>
                    <strong>{doc.name}</strong>
                  </p>
                  <button
                    className="tertiary"
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
                className="secondary"
                onClick={() => {
                  setStep(2);
                  setCurrentDocuments([]);
                }}
              >
                Retour
              </button>
              <button
                className="primary"
                type="button"
                onClick={handleAddExpense}
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
              <h5 style={{ marginTop: "2rem" }}>Abandon de frais</h5>
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
                        step="0.01"
                        name="amountWaiver"
                        placeholder="Entrez la somme abandonnée ici"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            /^\d*([.,]\d{0,2})?$/.test(value) ||
                            value === ""
                          ) {
                            handleInputChange(e, false);
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            e.target.value = value.toFixed(2);
                          }
                        }}
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
                      formData.amountWaiver > 0 &&
                      (() => {
                        const rate = waiverMileageRates.find(
                          (r) => r.label === formData.waiverMileageRate,
                        );

                        const totalAmount = rate
                          ? totalKm * rate.amountPerKm
                          : 0;

                        const effectiveAmount = Math.min(
                          totalAmount,
                          formData.amountWaiver,
                        );

                        const realAmount = effectiveAmount * (1 - 0.66);

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

          <h5 style={{ marginTop: "2rem" }}>Remboursement</h5>
          <p>
            Je souhaite que le CST me rembourse :{" "}
            {(totalAll.toFixed(2) - Number(formData.amountWaiver || 0)).toFixed(
              2,
            )}
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
            <button className="secondary" onClick={() => setStep(2)}>
              Retour
            </button>
            <button
              className="primary"
              onClick={async () => {
                await handleGeneratePdf();

                sendData(userSelected);
              }}
            >
              Générer le PDF
            </button>
          </div>
        </>
      ) : step === 4 ? (
        <>
          <p>
            Envoyer directement la note de frais à l'association à l'adresse
            mail suivante : {contact.label} - {contact.email}
          </p>
          <div className={styles.nextPrevButton}>
            <button className="secondary" type="button" onClick={handleSendPdf}>
              Envoyer
            </button>
            <button
              className="primary"
              onClick={() => {
                setTab("home");
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
              }}
            >
              Revenir au tableau de bord
            </button>
          </div>
        </>
      ) : null}
    </form>
  );
}
