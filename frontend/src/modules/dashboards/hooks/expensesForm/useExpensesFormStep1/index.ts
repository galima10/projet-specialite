import type { FormData } from "@app-types/FormData";

export function useExpensesFormStep1(formData: FormData, setStep) {
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
  return { handleValidateInfos };
}
