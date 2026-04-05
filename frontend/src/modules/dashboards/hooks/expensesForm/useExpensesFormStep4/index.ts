import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { useEffect } from "react";
import { fetchAssociationContactsThunk } from "@stores/thunks/association";

export function useExpensesFormStep4() {
  const dispatch = useAppDispatch();
  const { contacts } = useAppSelector((state) => state.association);
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchAssociationContactsThunk());
    }
  }, []);
  async function handleSendPdf() {
    // const user = userSelected
    //   ? users.find((u) => u.id === userSelected.id)
    //   : currentUser;
    // const report: File = expensesReports
    //   .find((e) => e.userId === user.id)
    //   .reports.find((r) => r.reason === formData.reason).file;
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
