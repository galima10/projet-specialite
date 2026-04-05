import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import {
  fetchAssociationContactsThunk,
  createAssociationContactThunk,
  deleteAssociationContact,
} from "@stores/thunks/association";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Contact } from "@stores/features/association";
import styles from "./AssociationContactManagement.module.scss";
import { useAssociationContactManagement } from "@modules/dashboards/hooks/useAssociationContactManagement";
import InputField from "../../atoms/InputField";

export default function AssociationContactManagement({
  setTab,
}: {
  setTab: Dispatch<
    SetStateAction<
      | "home"
      | "viewProfile"
      | "addReport"
      | "setUser"
      | "mileagesManagement"
      | "viewReport"
      | "association"
    >
  >;
}) {
  const {
    setIsModified,
    setFormData,
    contacts,
    isModified,
    handleSubmit,
    handleInputChange,
    sendData,
    fieldErrors,
    setFieldErrors,
  } = useAssociationContactManagement();

  return (
    <div className={styles.association}>
      <h4>Contact actuel de l'association</h4>
      <button
        className="secondary"
        onClick={() => {
          setTab("home");
          setIsModified(false);
          setFormData({
            label: "",
            email: "",
          });
          setFieldErrors({
            label: null,
            email: null,
          });
        }}
      >
        Retour
      </button>
      {contacts.length !== 0 && (
        <p>
          <strong>{contacts[0].label} :</strong> {contacts[0].email}
        </p>
      )}
      {contacts.length === 0 ? (
        <button className="primary" onClick={() => setIsModified(true)}>
          Ajouter le contact
        </button>
      ) : (
        <button className="tertiary" onClick={() => setIsModified(true)}>
          Modifier le contact
        </button>
      )}
      {isModified && (
        <form onSubmit={handleSubmit}>
          <InputField
            handleInputChange={handleInputChange}
            label="Label du contact"
            id="label"
            name="label"
            type="text"
            placeholder="Entrez un label..."
            error={fieldErrors.label}
          />
          <InputField
            handleInputChange={handleInputChange}
            label="Email du contact"
            id="email"
            name="email"
            type="email"
            placeholder="Entrez une adresse mail..."
            error={fieldErrors.email}
          />
          <div className={styles.nextPrevButton}>
            <button
              className="secondary"
              onClick={() => {
                setIsModified(false);
                setFormData({
                  label: "",
                  email: "",
                });
                setFieldErrors({
                  label: null,
                  email: null,
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
      )}
    </div>
  );
}
