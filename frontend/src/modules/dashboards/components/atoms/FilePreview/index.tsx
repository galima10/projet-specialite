import { Dispatch, SetStateAction } from "react";
import styles from "./FilePreview.module.scss";

interface FilePreviewProps {
  index: number;
  file: {
    name: string;
    preview: string;
  };
  setCurrentDocuments: Dispatch<
    SetStateAction<
      {
        name: string;
        preview: string;
        file: File;
      }[]
    >
  >;
}

export default function FilePreview({
  index,
  file,
  setCurrentDocuments,
}: FilePreviewProps) {
  return (
    <div className={styles.input}>
      <img src={file.preview ?? ""} alt={file.name} />
      <p>
        <strong>{file.name}</strong>
      </p>
      <button
        className="tertiary"
        type="button"
        onClick={() =>
          setCurrentDocuments((prev) => prev.filter((_, i) => i !== index))
        }
      >
        Supprimer
      </button>
    </div>
  );
}
