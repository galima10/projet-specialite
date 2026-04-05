import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { useEffect } from "react";
import { fetchAssociationContactsThunk } from "@stores/thunks/association";
import type { Users } from "@stores/features/users";
import { API_ROUTES } from "@constants/apiroute";
const API_URL = import.meta.env.VITE_API_URL;

export function useExpensesFormStep4(
  userSelected: Users,
  file: File,
  reason: string,
) {
  const dispatch = useAppDispatch();
  const { contacts } = useAppSelector((state) => state.association);
  const { currentUser, users } = useAppSelector((state) => state.user);
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchAssociationContactsThunk());
    }
  }, []);
  const actualUser = userSelected ? userSelected : currentUser;
  console.log(actualUser);
  async function handleSendPdf() {
    console.log(expensesReports);
    // const user = userSelected
    //   ? users.find((u) => u.id === userSelected.id)
    //   : currentUser;
    // const res = await fetch(
    //   `${API_URL}${API_ROUTES.ASSOCIATION_CONTACTS}/send/${report.id}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //   },
    // );
    // if (!res.ok) throw new Error("Error create contact");
  }
  return { contact: contacts[0], handleSendPdf };
}
