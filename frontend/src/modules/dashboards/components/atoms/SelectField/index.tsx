import { ChangeEvent } from "react";
import styles from "./SelectField.module.scss";

interface SelectFieldProps {
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement, Element>,
    isExpense?: boolean,
  ) => void;
  label: string;
  id: string;
  name?: string;
  options: {
    name: string;
    value: string;
  }[];
  value?: string;
  error?: string | null;
}

export default function SelectField({
  handleInputChange,
  label,
  id,
  name,
  options,
  value,
  error,
}: SelectFieldProps) {
  return (
    <div className={styles.input}>
      <label htmlFor={id}>{label}</label>
      <select value={value} name={name} id={id} onChange={handleInputChange}>
        <option value="">--Choisissez une option--</option>
        {options.map((item) => {
          return (
            <option key={`${item.name}`} value={item.value}>
              {item.name}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="error">
          <small>{error}</small>
        </p>
      )}
    </div>
  );
}
