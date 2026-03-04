import type { TFunction } from "i18next";
import { PHONE_COUNTRIES } from "../constants/phoneCountries";

export interface FormData {
  last_name: string;
  first_name: string;
  pseudo: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
}

export interface FormErrors {
  [key: string]: string;
}

export function validate(
  formData: FormData,
  phoneCountry: string,
  t: TFunction,
): FormErrors {
  const newErrors: FormErrors = {};

  if (!formData.last_name.trim())
    newErrors.last_name = t("register.errors.lastName.required");
  if (!formData.first_name.trim())
    newErrors.first_name = t("register.errors.firstName.required");

  if (!formData.pseudo.trim()) {
    newErrors.pseudo = t("register.errors.pseudo.required");
  } else if (formData.pseudo.length < 3 || formData.pseudo.length > 15) {
    newErrors.pseudo = t("register.errors.pseudo.length");
  }

  if (!formData.email.trim()) {
    newErrors.email = t("register.errors.email.required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = t("register.errors.email.invalid");
  }

  if (!formData.password) {
    newErrors.password = t("register.errors.password.required");
  } else {
    const hasMinLength = formData.password.length >= 8;
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasLower = /[a-z]/.test(formData.password);
    const hasDigit = /[0-9]/.test(formData.password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(formData.password);
    if (!hasMinLength || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      newErrors.password = t("register.errors.password.required");
    }
  }

  if (!formData.phone.trim()) {
    newErrors.phone = t("register.errors.phone.required");
  } else {
    const country = PHONE_COUNTRIES.find((c) => c.code === phoneCountry);
    if (country && !country.pattern.test(formData.phone)) {
      newErrors.phone = t("register.errors.phone.invalid");
    }
  }

  if (!formData.birthday) {
    newErrors.birthday = t("register.errors.birthday.required");
  } else if (new Date(formData.birthday) >= new Date()) {
    newErrors.birthday = t("register.errors.birthday.invalid");
  }

  return newErrors;
}

export function isFieldValid(
  name: keyof FormData,
  formData: FormData,
  errors: FormErrors,
  phoneCountry: string,
  pseudoAvailable: boolean | null,
): boolean {
  if (!formData[name]) return false;
  if (errors[name]) return false;

  switch (name) {
    case "last_name":
    case "first_name":
      return formData[name].trim().length > 0;
    case "pseudo":
      return (
        formData[name].length >= 3 &&
        formData[name].length <= 15 &&
        pseudoAvailable === true
      );
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name]);
    case "password": {
      const p = formData[name];
      return (
        p.length >= 8 &&
        /[A-Z]/.test(p) &&
        /[a-z]/.test(p) &&
        /[0-9]/.test(p) &&
        /[^a-zA-Z0-9]/.test(p)
      );
    }
    case "phone": {
      const country = PHONE_COUNTRIES.find((c) => c.code === phoneCountry);
      return country ? country.pattern.test(formData[name]) : false;
    }
    case "birthday":
      return new Date(formData[name]) < new Date();
    default:
      return false;
  }
}
