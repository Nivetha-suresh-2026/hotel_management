export const validateEmail = (email) => {
  return email.includes("@");
};

export const validateRequired = (value) => {
  return value && value.trim() !== "";
};