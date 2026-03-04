import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { registerUser, type RegisterResponse } from "../services/userService";
import usePseudoAvailability from "../hooks/usePseudoAvailability";
import { calculateAge } from "../utils/date";
import {
  validate,
  isFieldValid,
  type FormData,
  type FormErrors,
} from "../utils/registerValidation";
import Input from "./ui/Input";
import Button from "./ui/Button";
import PhoneInput from "./ui/PhoneInput";
import PasswordStrengthIndicator from "./ui/PasswordStrengthIndicator";
import PseudoRulesIndicator from "./ui/PseudoRulesIndicator";

interface ServerErrorResponse {
  errors: Record<string, string[]>;
}

function RegisterForm() {
  const { t } = useTranslation();

  const [phoneCountry, setPhoneCountry] = useState("FR");

  const [formData, setFormData] = useState<FormData>({
    last_name: "",
    first_name: "",
    pseudo: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");

  const { pseudoAvailable, pseudoChecking, pseudoError } =
    usePseudoAvailability(formData.pseudo, t);

  useEffect(() => {
    if (pseudoError) {
      setErrors((prev) => ({ ...prev, pseudo: pseudoError }));
    } else if (pseudoAvailable === true) {
      setErrors((prev) => ({ ...prev, pseudo: "" }));
    }
  }, [pseudoError, pseudoAvailable]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const mutation = useMutation<
    RegisterResponse,
    AxiosError<ServerErrorResponse>,
    globalThis.FormData
  >({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setSuccess(data.message || t("register.success"));
      setFormData({
        last_name: "",
        first_name: "",
        pseudo: "",
        email: "",
        password: "",
        phone: "",
        birthday: "",
      });
      setErrors({});
      setAvatarFile(null);
      setAvatarPreview(null);
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data?.errors;
        if (serverErrors) {
          const formatted: FormErrors = {};
          Object.keys(serverErrors).forEach((key) => {
            formatted[key] = serverErrors[key]?.[0] ?? "";
          });
          setErrors(formatted);
        }
      } else {
        setErrors({ general: t("register.errors.general") });
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: t("register.errors.avatar.type"),
      }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: t("register.errors.avatar.size"),
      }));
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");

    const validationErrors = validate(formData, phoneCountry, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = new globalThis.FormData();
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) =>
      payload.append(key, formData[key]),
    );
    payload.append("phone_country", phoneCountry);
    if (avatarFile) payload.append("avatar", avatarFile);

    mutation.mutate(payload);
  };

  const checkFieldValid = (name: keyof FormData): boolean =>
    isFieldValid(name, formData, errors, phoneCountry, pseudoAvailable);

  const age = calculateAge(formData.birthday);
  const pseudoLength = formData.pseudo.length;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success && (
        <div
          role="alert"
          className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-sm"
        >
          {success}
        </div>
      )}

      {errors.general && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-sm"
        >
          {errors.general}
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div className="flex-1 flex flex-col gap-4">
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            label={t("register.fields.lastName")}
            required
            error={errors.last_name}
            isValid={checkFieldValid("last_name")}
          />
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            label={t("register.fields.firstName")}
            required
            error={errors.first_name}
            isValid={checkFieldValid("first_name")}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-primary flex items-center justify-center overflow-hidden transition-colors">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-text-secondary text-center px-1">
                  {t("register.fields.avatar")}
                </span>
              )}
            </div>
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/jpeg,image/png"
            onChange={handleAvatarChange}
            className="sr-only"
          />
          {errors.avatar && (
            <p
              role="alert"
              className="mt-1 text-xs text-red-500 text-center max-w-24"
            >
              {errors.avatar}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Input
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          label={t("register.fields.pseudo")}
          required
          error={errors.pseudo}
          maxLength={15}
          isValid={checkFieldValid("pseudo")}
        >
          <span
            className={`float-right text-xs font-normal ${
              pseudoLength > 0 && (pseudoLength < 3 || pseudoLength > 15)
                ? "text-red-500"
                : pseudoLength > 0
                  ? "text-green-500"
                  : "text-text-secondary"
            }`}
          >
            {pseudoLength}/15
          </span>
        </Input>
        {formData.pseudo && (
          <PseudoRulesIndicator
            pseudo={formData.pseudo}
            pseudoAvailable={pseudoAvailable}
            pseudoChecking={pseudoChecking}
          />
        )}
      </div>

      <div className="mb-4">
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          label={t("register.fields.email")}
          required
          error={errors.email}
          isValid={checkFieldValid("email")}
        />
      </div>

      <div className="mb-4">
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          label={t("register.fields.password")}
          required
          error={errors.password}
          isValid={checkFieldValid("password")}
        />
        {formData.password && (
          <PasswordStrengthIndicator
            password={formData.password}
            personalInfo={formData}
          />
        )}
      </div>

      <div className="mb-4">
        <PhoneInput
          phoneCountry={phoneCountry}
          onCountryChange={(country) => {
            setPhoneCountry(country);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          isValid={checkFieldValid("phone")}
        />
      </div>

      <div className="mb-6">
        <Input
          id="birthday"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          label={t("register.fields.birthday")}
          required
          error={errors.birthday}
          isValid={checkFieldValid("birthday")}
        >
          {age !== null && (
            <span className="float-right text-xs font-normal text-primary">
              ({t("register.age", { age, count: age })})
            </span>
          )}
        </Input>
      </div>

      <Button type="submit" loading={mutation.isPending}>
        {mutation.isPending ? t("register.submitting") : t("register.submit")}
      </Button>
    </form>
  );
}

export default RegisterForm;
