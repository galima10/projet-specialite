import { useState, useEffect } from "react";
import UsersList from "../../molecules/UsersList";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchUsersThunk } from "@stores/thunks/users";
import { Users } from "@stores/features/users";
import UserProfile from "../../molecules/UserProfile";
import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";
import { fetchExpensesReportsThunk } from "@stores/thunks/expensesReports";

export default function ContentAdminDashboard() {
  const [tab, setTab] = useState<"home" | "viewProfile" | "addReport">("home");
  const [selectedUser, setSelectedUser] = useState<Users>(null);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsersThunk());
    }
    if (!expensesReports || expensesReports.length === 0) {
      dispatch(fetchExpensesReportsThunk());
    }
  }, []);
  return (
    <div>
      {tab === "home" ? (
        <UsersList
          users={users}
          setSelectedUser={setSelectedUser}
          setTab={setTab}
        />
      ) : tab === "viewProfile" ? (
        <UserProfile
          user={selectedUser}
          setTab={setTab}
          expensesReports={expensesReports}
        />
      ) : (
        <ExpensesReportsForm setTab={setTab} userSelected={selectedUser} />
      )}
    </div>
  );
}
