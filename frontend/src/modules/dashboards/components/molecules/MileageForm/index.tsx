import InputField from "../../atoms/InputField";
import SelectField from "../../atoms/SelectField";
import { rateType } from "@constants/mileageForm";
import styles from "./MileageForm.module.scss";
import { useMileageForm } from "@modules/dashboards/hooks/mileageForm";
import { Dispatch, SetStateAction } from "react";

export default function MileageForm({
  setMileagesTab,
  formType,
}: {
  setMileagesTab: Dispatch<SetStateAction<"list" | "setMileage">>;
  formType: "km" | "waiver";
}) {
  const { handleInputChange, handleSubmit, sendData, setFormData } =
    useMileageForm(formType, setMileagesTab);
  return (
    <form onSubmit={handleSubmit}>
      <InputField
        handleInputChange={handleInputChange}
        label="Label"
        id="label"
        name="label"
        type="text"
        placeholder="Entrez un label..."
      />
      <InputField
        handleInputChange={(e) => {
          const value = e.target.value;
          if (/^\d*([.,]\d{0,3})?$/.test(value) || value === "") {
            handleInputChange(e);
          }
        }}
        onBlur={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value)) {
            e.target.value = value.toFixed(3);
          }
        }}
        label="Montant par km"
        id="amountPerKm"
        name="amountPerKm"
        type="number"
        placeholder="Entrez un montant par km..."
        step="0.001"
        defaultValue={0}
        min={0}
      />
      <SelectField
        handleInputChange={handleInputChange}
        label="Type"
        id="type"
        name="type"
        options={rateType}
      />
      <div className={styles.nextPrevButton}>
        <button
          className="secondary"
          onClick={() => {
            setMileagesTab("list");
            setFormData({
              label: "",
              amountPerKm: 0,
              type: "",
            });
          }}
        >
          Annuler
        </button>
        <button className="primary" onClick={sendData}>
          Enregistrer
        </button>
      </div>
    </form>
  );
}
