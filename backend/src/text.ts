/** Ujednolica nazwę do porównań: „  Ser  Feta ” → „ser feta”. */
export const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase("pl-PL").replace(/\s+/g, " ");
