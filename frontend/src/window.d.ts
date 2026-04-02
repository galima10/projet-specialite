export {};

declare global {
  interface Window {
    html2pdf: (() => {
      set: (options: any) => ReturnType<typeof window.html2pdf>;
      from: (element: HTMLElement | string) => ReturnType<typeof window.html2pdf>;
      save: () => void;
      outputPdf: {
        (type: "blob"): Promise<Blob>;
        (type: "datauristring" | "dataurlstring"): Promise<string>;
        (): Promise<Blob>; // valeur par défaut
      };
    });
  }
}
