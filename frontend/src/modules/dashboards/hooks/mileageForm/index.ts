import { useAppDispatch } from "@modules/shared/hooks/redux";
import { createMileageRateThunk } from "@stores/thunks/mileages";
import { useState, Dispatch, SetStateAction } from "react";
import type { MileageRate } from "@stores/features/mileages";

export function useMileageForm(
  formType: "km" | "waiver",
  setMileagesTab: Dispatch<SetStateAction<"list" | "setMileage">>,
) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    label: "",
    amountPerKm: 0,
    type: "",
  });
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function sendData() {
    console.log(formData);
    if (
      formData.label === "" ||
      formData.amountPerKm === 0 ||
      formData.type === ""
    ) {
      console.log("manque de champs");
      return null;
    }

    const newMileage: MileageRate = {
      label: formData.label,
      amountPerKm: Number(formData.amountPerKm),
      type: formData.type,
    };

    if (formType === "km")
      dispatch(createMileageRateThunk({ newMileage, type: "KM" }));
    else dispatch(createMileageRateThunk({ newMileage, type: "WAIVER" }));

    setFormData({
      label: "",
      amountPerKm: 0,
      type: "",
    });
    setMileagesTab("list");
  }
  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
  }
  return { handleInputChange, sendData, handleSubmit, setFormData };
}
