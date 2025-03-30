export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcCheckDigit = (base: string, factor: number) =>
    base
      .split('')
      .reduce((sum, num, index) => sum + parseInt(num) * (factor - index), 0);

  const digit1 = (calcCheckDigit(cpf.substring(0, 9), 10) * 10) % 11;
  const digit2 = (calcCheckDigit(cpf.substring(0, 10), 11) * 10) % 11;

  return digit1 % 10 === parseInt(cpf[9]) && digit2 % 10 === parseInt(cpf[10]);
};

// Função para validar número de celular brasileiro
export const isValidCellphone = (phone: string): boolean => {
  phone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
  return /^(\d{2})?(9\d{8})$/.test(phone); // Aceita formato com ou sem DDD
};
