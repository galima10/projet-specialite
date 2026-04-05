import { Users } from "@stores/features/users";
import { useAppDispatch } from "@modules/shared/hooks/redux";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { createUserThunk, updateUserThunk } from "@stores/thunks/users";

export function useUserForm(
  users: Users[],
  userId: number,
  setTab: Dispatch<SetStateAction<"home" | "addReport">>,
  type: "create" | "update",
) {
  const [fieldErrors, setFieldErrors] = useState({
    name: null,
    email: null,
    password: null,
    role: null,
  });
  const adminsCount = users.filter((u) => u.role === "ROLE_ADMIN");
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Users & { password: string }>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const selectedUser = userId ? users.find((u) => u.id === userId) : null;
  useEffect(() => {
    if (userId) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        password: "",
      });
    }
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const { name, value } = target;

    if (name === "name" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          name: null,
        };
      });
    }
    if (name === "email" && Number(value) !== 0) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          email: null,
        };
      });
    }
    if (name === "password" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          password: null,
        };
      });
    }
    if (name === "role" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          role: null,
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
    if (formData.name === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          name: "Veuillez entrer un nom d'utilisateur",
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
    if (formData.password === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          password: "Veuillez entrer un mot de passe",
        };
      });
    }
    if (formData.role === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          role: "Veuillez entrer un rôle",
        };
      });
    }
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.role === ""
    ) {
      return null;
    }

    const newUser: Users = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    const newPassword = formData.password;
    if (type === "create") dispatch(createUserThunk({ newUser, newPassword }));
    else {
      newUser.id = userId;
      dispatch(updateUserThunk({ newUser, newPassword }));
    }
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setTab("home");
  }
  return {
    handleSubmit,
    handleInputChange,
    selectedUser,
    adminsCount,
    setFormData,
    sendData,
    fieldErrors,
  };
}
