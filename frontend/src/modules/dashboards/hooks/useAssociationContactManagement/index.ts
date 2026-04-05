import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  fetchAssociationContactsThunk,
  updateAssociationContactThunk,
  createAssociationContactThunk,
  deleteAssociationContact,
} from "@stores/thunks/association";
import type { Contact } from "@stores/features/association";

export function useAssociationContactManagement() {
  const [fieldErrors, setFieldErrors] = useState({
    label: null,
    email: null,
  });
  const dispatch = useAppDispatch();
  const { contacts } = useAppSelector((state) => state.association);
  const [isModified, setIsModified] = useState(false);
  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchAssociationContactsThunk());
    }
    setFormData({
      label: "",
      email: "",
    });
  }, []);
  const [formData, setFormData] = useState<Contact>({
    label: "",
    email: "",
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
    if (name === "email" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          email: null,
        };
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
    if (formData.email === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          email: "Veuillez entrer une adresse mail",
        };
      });
    }
    if (formData.label === "" || formData.email === "") {
      return null;
    }
    if (contacts.length === 0)
      dispatch(createAssociationContactThunk(formData));
    else {
      dispatch(deleteAssociationContact(contacts[0]?.id));
      dispatch(createAssociationContactThunk(formData));
    }

    setFieldErrors({
      label: null,
      email: null,
    });

    setFormData({
      label: "",
      email: "",
    });
    setIsModified(false);
  }
  return {
    setIsModified,
    setFormData,
    contacts,
    isModified,
    handleSubmit,
    handleInputChange,
    sendData,
    fieldErrors,
    setFieldErrors
  };
}
