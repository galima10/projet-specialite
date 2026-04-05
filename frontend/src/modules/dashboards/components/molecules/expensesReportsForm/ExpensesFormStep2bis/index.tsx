import styles from "@modules/dashboards/components/organisms/ExpensesReportsForm/ExpensesReportForm.module.scss";
import { Dispatch, SetStateAction, ChangeEvent } from "react";
import type { FormData } from "@app-types/FormData";
import { useExpensesFormStep2bis } from "@modules/dashboards/hooks/expensesForm/useExpensesFormStep2bis";
import InputField from "@modules/dashboards/components/atoms/InputField";
import CheckboxField from "@modules/dashboards/components/atoms/CheckboxField";
import FilePreview from "@modules/dashboards/components/atoms/FilePreview";
import FileField from "@modules/dashboards/components/atoms/FileField";

interface ExpensesFormStep2bisProps {
  handleInputChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
    isExpense?: boolean,
  ) => void;
  hasKm: boolean;
  setHasKm: Dispatch<SetStateAction<boolean>>;
  setCurrentExpense: Dispatch<
    SetStateAction<{
      expenseDate: string;
      object: string;
      km: number;
      transportCost: number;
      othersCost: number;
      documents: any;
    }>
  >;
  hasTransport: boolean;
  setHasTransport: Dispatch<SetStateAction<boolean>>;
  hasOther: boolean;
  setHasOther: Dispatch<SetStateAction<boolean>>;
  currentDocuments: {
    name: string;
    preview: string;
    file: File;
  }[];
  handleDocumentChange: (e: ChangeEvent<HTMLInputElement, Element>) => void;
  setCurrentDocuments: Dispatch<
    SetStateAction<
      {
        name: string;
        preview: string;
        file: File;
      }[]
    >
  >;
  setStep: Dispatch<SetStateAction<number>>;
  currentExpense: {
    expenseDate: string;
    object: string;
    km: number;
    transportCost: number;
    othersCost: number;
    documents: any;
  };
  setFormData: Dispatch<SetStateAction<FormData>>;
}

export default function ExpensesFormStep2bis({
  handleInputChange,
  hasKm,
  setHasKm,
  setCurrentExpense,
  hasTransport,
  setHasTransport,
  hasOther,
  setHasOther,
  currentDocuments,
  handleDocumentChange,
  setCurrentDocuments,
  setStep,
  currentExpense,
  setFormData,
}: ExpensesFormStep2bisProps) {
  const { handleAddExpense } = useExpensesFormStep2bis(
    hasKm,
    currentExpense,
    hasTransport,
    hasOther,
    currentDocuments,
    setCurrentExpense,
    setFormData,
    setCurrentDocuments,
    setStep,
  );
  return (
    <div>
      <InputField
        handleInputChange={(e) => handleInputChange(e, true)}
        label="Date de la dépense"
        id="expenseDate"
        name="expenseDate"
        type="date"
        placeholder="Choisissez une date"
      />
      <InputField
        handleInputChange={(e) => handleInputChange(e, true)}
        label="Objet de la dépense"
        id="expenseObject"
        name="object"
        type="text"
        placeholder="Entrez l'objet de la dépense"
      />
      <div>
        <h5 style={{ marginTop: "2rem" }}>Ajouter :</h5>
        <div className={styles.checkboxContainer}>
          <CheckboxField
            handleInputChange={(e) => {
              setHasKm(e.target.checked);
              !hasKm &&
                setCurrentExpense((prev) => {
                  return {
                    ...prev,
                    km: 0,
                  };
                });
            }}
            label="des kilomètres ?"
            id="expenseHasKm"
            checked={hasKm}
          />
          {hasKm && (
            <InputField
              handleInputChange={(e) => {
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
              label="Nombre de kilomètres"
              id="expenseKm"
              name="km"
              type="number"
              placeholder="Entrez le nombre de km parcouru"
              step="0.01"
              defaultValue={0}
              min={0}
            />
          )}
          <div className={styles.checkboxContainer}>
            <CheckboxField
              handleInputChange={(e) => {
                setHasTransport(e.target.checked);
                !hasTransport &&
                  setCurrentExpense((prev) => {
                    return {
                      ...prev,
                      transportCost: 0,
                    };
                  });
              }}
              label="des coûts de péages ou autres transports ?"
              id="expenseHasTransport"
              checked={hasTransport}
            />
          </div>
          {hasTransport && (
            <InputField
              handleInputChange={(e) => {
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
              label="Coût de transport"
              id="expenseTransport"
              name="transportCost"
              type="number"
              placeholder="Entrez le coût ici"
              step="0.01"
              defaultValue={0}
              min={0}
            />
          )}
        </div>
        <div className={styles.checkboxContainer}>
          <CheckboxField
            handleInputChange={(e) => {
              setHasOther(e.target.checked);
              !hasOther &&
                setCurrentExpense((prev) => {
                  return {
                    ...prev,
                    othersCost: 0,
                  };
                });
            }}
            label="d'autres coûts ?"
            id="expenseHasOther"
            checked={hasOther}
          />
          {hasOther && (
            <InputField
              handleInputChange={(e) => {
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
              label="Autres coûts"
              id="expenseOther"
              name="othersCost"
              type="number"
              placeholder="Entrez le coût ici"
              step="0.01"
              defaultValue={0}
              min={0}
            />
          )}
        </div>
        <div className={styles.fileContainer}>
          {currentDocuments.map((doc, index) => (
            <FilePreview
              key={`file-prev-${index}`}
              index={index}
              file={doc}
              setCurrentDocuments={setCurrentDocuments}
            />
          ))}
          <FileField
            label="Ajouter des justificatifs"
            id="expenseDocument"
            handleDocumentChange={handleDocumentChange}
          />
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
          <button className="primary" type="button" onClick={handleAddExpense}>
            Ajouter la dépense
          </button>
        </div>
      </div>
    </div>
  );
}
