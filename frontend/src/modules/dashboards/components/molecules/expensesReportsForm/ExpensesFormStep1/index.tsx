import { useExpensesFormStep1 } from "@modules/dashboards/hooks/useExpensesFormStep1";

interface ExpensesFormStep1Props {
  handleInputChange: () => void;
  formData: {
    userName: string,
    createdAt: string,
    reason: string,
    budget: string,
    amountWaiver: number,
    waiverMileageRate: number | null,
    kmMileageRate: number | null,
    reportDocumentFile: File | null,
    expensesList: {
    date: string,
    object: string,
    km: number,
    transportCost: number,
    othersCost: number,
    documents: null,
  }[],
    userIBAN: string,
    userBIC: string,
    signature: string,
  };
  setStep: () => void
}

export default function ExpensesFormStep1({
  handleInputChange,
  formData
}: ExpensesFormStep1Props) {
  return (
    <div>
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
        <select name="budget" id="budgetRequest" onChange={handleInputChange}>
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
    </div>
  );
}
