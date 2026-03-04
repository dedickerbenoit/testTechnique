export interface PhoneCountry {
  code: string;
  dial: string;
  flag: string;
  pattern: RegExp;
  placeholder: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    code: "FR",
    dial: "+33",
    flag: "\u{1F1EB}\u{1F1F7}",
    pattern: /^0[67]\d{8}$/,
    placeholder: "0612345678",
  },
  {
    code: "BE",
    dial: "+32",
    flag: "\u{1F1E7}\u{1F1EA}",
    pattern: /^0[4-9]\d{7,8}$/,
    placeholder: "0471234567",
  },
  {
    code: "CH",
    dial: "+41",
    flag: "\u{1F1E8}\u{1F1ED}",
    pattern: /^0[7]\d{8}$/,
    placeholder: "0791234567",
  },
  {
    code: "LU",
    dial: "+352",
    flag: "\u{1F1F1}\u{1F1FA}",
    pattern: /^\d{6,9}$/,
    placeholder: "621123456",
  },
];
