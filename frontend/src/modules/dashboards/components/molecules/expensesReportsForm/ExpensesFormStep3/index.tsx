import type { FormData } from "@app-types/FormData";
import SignatureField from "@modules/dashboards/components/atoms/SignatureField";
import { useExpensesFormStep3 } from "@modules/dashboards/hooks/expensesForm/useExpensesFormStep3";
import styles from "@modules/dashboards/components/organisms/ExpensesReportsForm/ExpensesReportForm.module.scss";
import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { Users } from "@stores/features/users";
import type { WithRequiredId } from "@app-types/WithRequiredId";
import type { MileageRate } from "@stores/features/mileages";
import InputField from "@modules/dashboards/components/atoms/InputField";
import SelectField from "@modules/dashboards/components/atoms/SelectField";
import CheckboxField from "@modules/dashboards/components/atoms/CheckboxField";
import type { FieldErrors } from "@app-types/FieldErrors";

interface ExpensesFormStep3Props {
  totalAll: number;
  totalKm: number;
  totalKmAmount: number;
  formData: FormData;
  userSelected: Users | null;
  totalTransportCost: number;
  totalOthersCost: number;
  setStep: Dispatch<SetStateAction<number>>;
  handleInputChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
    isExpense?: boolean,
  ) => void;
  hasWaiver: boolean;
  setHasWaiver: Dispatch<SetStateAction<boolean>>;
  setFormData: Dispatch<SetStateAction<FormData>>;
  rateTypeSelected: "CAR" | "MOTORCYCLE";
  filteredWaiverMileageRates: WithRequiredId<MileageRate>[];
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>;
  fieldErrors: FieldErrors;
}

export default function ExpensesFormStep3({
  totalAll,
  totalKm,
  totalKmAmount,
  formData,
  userSelected,
  totalTransportCost,
  totalOthersCost,
  setStep,
  handleInputChange,
  hasWaiver,
  setHasWaiver,
  setFormData,
  filteredWaiverMileageRates,
  fieldErrors,
  setFieldErrors,
}: ExpensesFormStep3Props) {
  const {
    kmMileageRates,
    handleGeneratePdf,
    handleSignatureChange,
    calculateTaxDeduction,
  } = useExpensesFormStep3(
    formData,
    userSelected,
    totalKm,
    totalKmAmount,
    totalTransportCost,
    totalOthersCost,
    totalAll,
    setStep,
    setFormData,
    setFieldErrors,
  );
  return (
    <div>
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

        {totalOthersCost > 0 && (
          <li>Total des autres frais : {totalOthersCost.toFixed(2)} €</li>
        )}
      </ul>
      {formData.expensesList.some((item) => item.km && item.km > 0) && (
        <>
          <SelectField
            handleInputChange={handleInputChange}
            label="Votre condition"
            id="kmMileageRate"
            name="kmMileageRate"
            options={kmMileageRates.map((item) => {
              return {
                name: item.label,
                value: item.label,
              };
            })}
            value={formData.kmMileageRate || ""}
            error={fieldErrors.kmMileageRate}
          />
          <h5 style={{ marginTop: "2rem" }}>Abandon de frais</h5>
          <div className={styles.inputContainer}>
            <CheckboxField
              handleInputChange={(e) => {
                setHasWaiver(e.target.checked);
                if (!hasWaiver) {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      amountWaiver: 0,
                      waiverMileageRate: "",
                    };
                  });
                  setFieldErrors((prev) => {
                    return {
                      ...prev,
                      amountWaiver: null,
                      waiverMileageRate: null,
                    };
                  });
                }
              }}
              label="Je souhaite faire un abandon de frais"
              id="expenseHasWaiver"
              checked={hasWaiver}
            />
            {hasWaiver && (
              <>
                <InputField
                  handleInputChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*([.,]\d{0,2})?$/.test(value) || value === "") {
                      const numeric = parseFloat(value.replace(",", "."));

                      if (!isNaN(numeric)) {
                        const clamped = Math.min(
                          numeric,
                          parseFloat(
                            (Math.round(totalAll * 100) / 100).toFixed(2),
                          ),
                        );

                        handleInputChange({
                          ...e,
                          target: {
                            ...e.target,
                            name: "amountWaiver",
                            value: clamped.toString(),
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      } else {
                        handleInputChange(e, false);
                      }
                    }
                  }}
                  label="De la somme de :"
                  id="amountWaiver"
                  name="amountWaiver"
                  type="number"
                  placeholder="Entrez la somme abandonnée ici"
                  value={formData.amountWaiver}
                  min={0}
                  error={fieldErrors.amountWaiver}
                />
                <SelectField
                  handleInputChange={handleInputChange}
                  label="Votre condition d'abandon"
                  id="waiverMileageRate"
                  name="waiverMileageRate"
                  options={filteredWaiverMileageRates.map((item) => {
                    return {
                      name: item.label,
                      value: item.label,
                    };
                  })}
                  value={formData.waiverMileageRate || ""}
                  error={fieldErrors.waiverMileageRate}
                />
                {formData.waiverMileageRate && formData.amountWaiver > 0 && (
                  <p>
                    Après déduction d'impôts (de 66%), le montant réel dépensé
                    sera de : {calculateTaxDeduction()} €
                  </p>
                )}
              </>
            )}
          </div>
        </>
      )}
      <h5 style={{ marginTop: "2rem" }}>Remboursement</h5>
      <p>
        Je souhaite que le CST me rembourse :{" "}
        {(
          Math.round((totalAll - (formData.amountWaiver ?? 0)) * 100) / 100
        ).toFixed(2)}
      </p>
      {Math.round((totalAll - (formData.amountWaiver ?? 0)) * 100) / 100 >
        0 && (
        <>
          <p>Sur le compte</p>
          <div className={styles.inputContainer}>
            <InputField
              handleInputChange={handleInputChange}
              label="IBAN :"
              id="userIBAN"
              name="userIBAN"
              type="text"
              placeholder="Entrez votre IBAN"
              error={fieldErrors.userIBAN}
              value={formData.userIBAN || ""}
            />
            <InputField
              handleInputChange={handleInputChange}
              label="BIC :"
              id="userBIC"
              name="userBIC"
              type="text"
              placeholder="Entrez votre BIC"
              error={fieldErrors.userBIC}
              value={formData.userBIC || ""}
            />
          </div>
        </>
      )}
      <div className={styles.input}>
        <SignatureField onChange={handleSignatureChange} error={fieldErrors.signature} value={formData.signature || ""} />
      </div>
      <div className={styles.nextPrevButton}>
        <button className="secondary" onClick={() => setStep(2)}>
          Retour
        </button>
        <button
          className="primary"
          onClick={async () => {
            await handleGeneratePdf();
          }}
        >
          Générer le PDF
        </button>
      </div>
    </div>
  );
}
