import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";
import type { WithRequiredId } from "@app-types/WithRequiredId";

import type { Contact } from "@stores/features/association";

export const fetchAssociationContactsThunk = createAsyncThunk<
  WithRequiredId<Contact>[]
>("association/fetchAssociationContacts", async () => {
  const res = await fetch(`${API_URL}${API_ROUTES.ASSOCIATION_CONTACTS}`);
  if (!res.ok) throw new Error("Error fetch association contacts");
  const data: WithRequiredId<Contact>[] = await res.json();
  return data;
});

export const createAssociationContactThunk = createAsyncThunk<
  WithRequiredId<Contact>,
  Contact
>("association/createAssociationContact", async (newContact: Contact) => {
  const res = await fetch(`${API_URL}${API_ROUTES.ASSOCIATION_CONTACTS}`, {
    method: "POST",
    body: JSON.stringify({
      label: newContact.label,
      email: newContact.email,
    }),
  });
  if (!res.ok) throw new Error("Error create contact");
  const data: WithRequiredId<Contact> = await res.json();
  return data;
});

export const updateAssociationContactThunk = createAsyncThunk<
  WithRequiredId<Contact>,
  WithRequiredId<Contact>
>(
  "association/updateAssociationContact",
  async (newContact: WithRequiredId<Contact>) => {
    const res = await fetch(
      `${API_URL}${API_ROUTES.ASSOCIATION_CONTACTS}/${newContact.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          label: newContact.label,
          email: newContact.email,
        }),
      },
    );
    if (!res.ok) throw new Error("Error update contact");
    const data: WithRequiredId<Contact> = await res.json();
    return data;
  },
);

export const deleteMileageRateThunk = createAsyncThunk<number, number>(
  "mileage/deleteMileageRate",
  async (contactId: number) => {
    const res = await fetch(
      `${API_URL}${API_ROUTES.ASSOCIATION_CONTACTS}/${contactId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Erreur lors de la suppression : ${res.status}`);
    }
    return contactId;
  },
);
