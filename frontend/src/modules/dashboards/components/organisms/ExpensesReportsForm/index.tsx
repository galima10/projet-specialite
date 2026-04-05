import { Dispatch, SetStateAction } from "react";
import { useExpensesReportsForm } from "@modules/dashboards/hooks/expensesForm/useExpensesReportsForm";
import type { Users } from "@stores/features/users";
import ExpensesFormStep1 from "../../molecules/expensesReportsForm/ExpensesFormStep1";
import ExpensesFormStep2 from "../../molecules/expensesReportsForm/ExpensesFormStep2";
import ExpensesFormStep2bis from "../../molecules/expensesReportsForm/ExpensesFormStep2bis";
import ExpensesFormStep3 from "../../molecules/expensesReportsForm/ExpensesFormStep3";
import ExpensesFormStep4 from "../../molecules/expensesReportsForm/ExpensesFormStep4";

export default function ExpensesReportsForm({
  setTab,
  userSelected,
}: {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
  userSelected?: Users | null;
}) {
  const {
    formData,
    setCurrentExpense,
    setFormData,
    currentDocuments,
    setCurrentDocuments,
    calculateTotals,
    currentExpense,
    removeExpense,
    handleDocumentChange,
    handleInputChange,
    handleSubmit,
    setStep,
    step,
    filteredWaiverMileageRates,
    rateTypeSelected,
    hasKm,
    hasOther,
    hasTransport,
    hasWaiver,
    setHasKm,
    setHasOther,
    setHasTransport,
    setHasWaiver,
    fieldErrors,
    setFieldErrors,
  } = useExpensesReportsForm(userSelected);
  const {
    totalAll,
    totalKm,
    totalKmAmount,
    totalTransportCost,
    totalOthersCost,
  } = calculateTotals();

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 ? (
        <ExpensesFormStep1
          handleInputChange={handleInputChange}
          setStep={setStep}
          setTab={setTab}
          formData={formData}
          setFieldErrors={setFieldErrors}
          fieldErrors={fieldErrors}
        />
      ) : step === 2 ? (
        <ExpensesFormStep2
          setHasKm={setHasKm}
          setHasOther={setHasOther}
          setHasTransport={setHasTransport}
          setStep={setStep}
          formData={formData}
          removeExpense={removeExpense}
          setFieldErrors={setFieldErrors}
          fieldErrors={fieldErrors}
        />
      ) : step === 2.5 ? (
        <ExpensesFormStep2bis
          setCurrentDocuments={setCurrentDocuments}
          setCurrentExpense={setCurrentExpense}
          setFormData={setFormData}
          setHasKm={setHasKm}
          setHasOther={setHasOther}
          setHasTransport={setHasTransport}
          setStep={setStep}
          hasKm={hasKm}
          hasOther={hasOther}
          hasTransport={hasTransport}
          handleDocumentChange={handleDocumentChange}
          handleInputChange={handleInputChange}
          currentDocuments={currentDocuments}
          currentExpense={currentExpense}
          setFieldErrors={setFieldErrors}
          fieldErrors={fieldErrors}
        />
      ) : step === 3 ? (
        <ExpensesFormStep3
          setFormData={setFormData}
          setHasWaiver={setHasWaiver}
          setStep={setStep}
          formData={formData}
          totalAll={totalAll}
          totalKm={totalKm}
          totalKmAmount={totalKmAmount}
          totalOthersCost={totalOthersCost}
          totalTransportCost={totalTransportCost}
          userSelected={userSelected}
          handleInputChange={handleInputChange}
          rateTypeSelected={rateTypeSelected}
          hasWaiver={hasWaiver}
          filteredWaiverMileageRates={filteredWaiverMileageRates}
          setFieldErrors={setFieldErrors}
          fieldErrors={fieldErrors}
        />
      ) : (
        step === 4 && (
          <ExpensesFormStep4
            setFormData={setFormData}
            setStep={setStep}
            setTab={setTab}
          />
        )
      )}
    </form>
  );
}
