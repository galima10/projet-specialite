export function useExpensesFormStep1(formData, setStep) {
  function handleValidateInfos() {
    if (
      formData.reason === "" ||
      formData.budget === "" ||
      formData.userName === ""
    ) {
      console.log("Il manque des champs");
      return null;
    }
    setStep(2);
  }
  return {};
}
