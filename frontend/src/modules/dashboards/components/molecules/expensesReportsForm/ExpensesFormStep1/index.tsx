import { useExpensesFormStep1 } from "@modules/dashboards/hooks/expensesForm/useExpensesFormStep1";
import styles from "@modules/dashboards/components/organisms/ExpensesReportsForm/ExpensesReportForm.module.scss";
import { Dispatch, SetStateAction, ChangeEvent } from "react";
import type { FormData } from "@app-types/FormData";
import { budget } from "@constants/expensesForm";
import InputField from "@modules/dashboards/components/atoms/InputField";
import SelectField from "@modules/dashboards/components/atoms/SelectField";

interface ExpensesFormStep1Props {
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement, Element>,
    isExpense?: boolean,
  ) => void;
  formData: FormData;
  setStep: Dispatch<SetStateAction<number>>;
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
}

export default function ExpensesFormStep1({
  handleInputChange,
  formData,
  setStep,
  setTab,
}: ExpensesFormStep1Props) {
  const { handleValidateInfos } = useExpensesFormStep1(formData, setStep);
  return (
    <div>
      <InputField
        handleInputChange={handleInputChange}
        label="Nom du demandeur"
        id="userName"
        name="userName"
        type="text"
        placeholder="ex : Jean Dupont"
        value={formData.userName}
      />
      <InputField
        handleInputChange={handleInputChange}
        label="Date de la demande<"
        id="dateRequest"
        type="text"
        defaultValue={formData.createdAt.split("T")[0]}
        disabled
      />
      <InputField
        handleInputChange={handleInputChange}
        label="Raison de la demande"
        id="reasonRequest"
        name="reason"
        type="text"
        placeholder="ex : WE Ardèche 02/2022 etc"
        value={formData.reason}
      />
      <SelectField
        handleInputChange={handleInputChange}
        label="Budget"
        id="budgetRequest"
        name="budget"
        options={budget}
        value={formData.budget}
      />
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
