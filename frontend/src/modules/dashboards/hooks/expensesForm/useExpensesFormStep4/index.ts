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
  const { currentUser } = useAppSelector((state) => state.user);
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchAssociationContactsThunk());
    }
  }, []);

  async function handleSendPdf() {
    const actualUser = userSelected ? userSelected : currentUser;
    const userReports = expensesReports?.find(
      (ex) => ex.userId === actualUser.id,
    );
    const actualReport = userReports?.reports.find((r) => r.reason === reason);
    const actualFile = actualReport?.pathFile;

    const pdfUrl = `${API_URL}/${actualFile}`;
    const to = contacts[0].email;
    const subject = encodeURIComponent(`Note de frais de ${actualUser.name}`);
    const body = encodeURIComponent(
      `Bonjour Member 2,\n\n` +
        `Veuillez trouver la note de frais du membre ${actualUser.name} ici : ${pdfUrl}\n\n`
    );

    // Envoi via Gmail en ligne
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailLink, "_blank");

    // Envoi via une application
    // const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
    // window.location.href = mailtoLink;

  }

  return { contact: contacts[0], handleSendPdf };
}
