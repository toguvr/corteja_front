export function maskCep(value: string) {
  value = value?.replace(/\D/g, "");
  value = value?.replace(/^(\d{5})(\d)/, "$1-$2");
  return value;
}

export function maskPhone(value: string) {
  value = value?.replace(/\D/g, "");
  value = value?.replace(/^(\d{2})(\d)/g, "($1)$2");
  value = value?.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

export function maskCurrency(value: string) {
  value = value?.replace(/\D/g, "");
  value = value?.replace(/(\d)(\d{2})$/, "$1,$2");
  value = value?.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
}

export const removeMask = (value: string) => {
  if (value) return value?.replace(/[^0-9,]/g, "")?.replace(",", ".");
};

export const nameInitials = (currentName: string) => {
  if (currentName) {
    return currentName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .substring(0, 1);
  }
};
