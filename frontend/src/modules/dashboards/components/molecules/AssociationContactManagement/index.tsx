import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import {
  fetchAssociationContactsThunk,
  createAssociationContactThunk,
  deleteAssociationContact,
} from "@stores/thunks/association";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Contact } from "@stores/features/association";
import styles from "./AssociationContactManagement.module.scss";

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  function sendData() {
    console.log(formData);
    if (formData.label === "" || formData.email === "") {
      console.log("manque de champs");
      return null;
    }
    if (contacts.length === 0)
      dispatch(createAssociationContactThunk(formData));
    else {
      dispatch(deleteAssociationContact(contacts[0]?.id));
      dispatch(createAssociationContactThunk(formData));
    }

    setFormData({
      label: "",
      email: "",
    });
    setIsModified(false);
  }

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
          <div className={styles.input}>
            <label htmlFor="label">Label du contact</label>
            <input
              id="label"
              type="text"
              placeholder="Entrez un label..."
              name="label"
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.input}>
            <label htmlFor="email">Label du contact</label>
            <input
              id="email"
              type="email"
              placeholder="Entrez un email..."
              name="email"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.nextPrevButton}>
            <button
              className="secondary"
              onClick={() => {
                setIsModified(false);
                setFormData({
                  label: "",
                  email: "",
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
