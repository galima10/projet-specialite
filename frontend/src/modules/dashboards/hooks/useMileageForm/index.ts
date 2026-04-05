import { useAppDispatch } from "@modules/shared/hooks/redux";
import { createMileageRateThunk } from "@stores/thunks/mileages";
import { useState, Dispatch, SetStateAction } from "react";
import type { MileageRate } from "@stores/features/mileages";

export function useMileageForm(
  formType: "km" | "waiver",
  setMileagesTab: Dispatch<SetStateAction<"list" | "setMileage">>,
) {
  const [fieldErrors, setFieldErrors] = useState({
    label: null,
    amountPerKm: null,
    type: null,
  });
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

    if (name === "label" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          label: null,
        };
      });
    }
    if (name === "amountPerKm" && Number(value) !== 0) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          amountPerKm: null,
        };
      });
    }
    if (name === "type" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          type: null,
        };
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function sendData() {
    if (formData.label === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          label: "Veuillez entrer un label",
        };
      });
    }
    if (formData.type === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          type: "Veuillez entrer un type de barème",
        };
      });
    }
    if (formData.amountPerKm === 0) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          amountPerKm: "Veuillez entrer un montant par km",
        };
      });
    }
    if (
      formData.label === "" ||
      formData.amountPerKm === 0 ||
      formData.type === ""
    ) {
      return null;
    }

    setFieldErrors({
      label: null,
      amountPerKm: null,
      type: null,
    });

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
  return {
    handleInputChange,
    sendData,
    handleSubmit,
    setFormData,
    fieldErrors,
    setFieldErrors
  };
}
