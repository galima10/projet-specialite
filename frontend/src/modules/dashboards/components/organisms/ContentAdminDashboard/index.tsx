import { useState, useEffect } from "react";
import UsersList from "../../molecules/UsersList";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchUsersThunk } from "@stores/thunks/users";
import { Users } from "@stores/features/users";
import UserProfile from "../../molecules/UserProfile";
import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";

export default function ContentAdminDashboard() {
  const [tab, setTab] = useState<"home" | "viewProfile" | "addReport">("home");
  const [selectedUser, setSelectedUser] = useState<Users>(null);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsersThunk());
    }
  }, [dispatch, users]);
  return (
    <div>
      {tab === "home" ? (
        <UsersList
          users={users}
          setSelectedUser={setSelectedUser}
          setTab={setTab}
        />
      ) : tab === "viewProfile" ? (
        <UserProfile user={selectedUser} setTab={setTab} />
      ) : (
        <ExpensesReportsForm setTab={setTab} userSelected={selectedUser} />
      )}
    </div>
  );
}
