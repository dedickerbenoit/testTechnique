import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { PHONE_COUNTRIES } from "../../constants/phoneCountries";
import Input from "./Input";

interface PhoneInputProps {
  phoneCountry: string;
  onCountryChange: (country: string) => void;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isValid?: boolean;
}

function PhoneInput({
  phoneCountry,
  onCountryChange,
  value,
  onChange,
  error,
  isValid,
}: PhoneInputProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label
        htmlFor="phone"
        className="block text-sm font-medium text-text-primary mb-1"
      >
        {t("register.fields.phone")} <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2">
        <select
          value={phoneCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm"
          aria-label={t("register.fields.phoneCountry")}
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <div className="flex-1">
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={value}
            onChange={onChange}
            error={error}
            placeholder={
              PHONE_COUNTRIES.find((c) => c.code === phoneCountry)?.placeholder
            }
            isValid={isValid}
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneInput;
