import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";
import { useState } from "react";

export default function ContentMemberDashboard() {
  const [tab, setTab] = useState<"home" | "addReport">("home");
  return (
    <div>
      {tab === "home" ? (
        <div>
          <button onClick={() => setTab("addReport")}>
            Ajouter une note de frais
          </button>
        </div>
      ) : (
        <ExpensesReportsForm setTab={setTab} />
      )}
    </div>
  );
}
