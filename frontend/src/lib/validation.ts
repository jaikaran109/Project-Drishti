export const PHONE_LENGTH = 10;

const PHONE_REGEX = new RegExp(`^\\d{${PHONE_LENGTH}}$`);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REPORT_FILE_REGEX = /\.(pdf|png|jpe?g)$/i;

type RegisterFormValues = {
  name: string;
  phone: string;
  fatherName: string;
  email: string;
  address: string;
  age: string;
  gender: string;
  password: string;
  confirm: string;
};

type ApplicationFormValues = {
  problem: string;
  details: string;
  previousTreatment: string;
  reportName: string;
};

const trimValue = (value: string) => value.trim();

export const sanitizeNumericInput = (value: string, maxLength?: number) => {
  const digitsOnly = value.replace(/\D/g, "");
  return typeof maxLength === "number"
    ? digitsOnly.slice(0, maxLength)
    : digitsOnly;
};

export const sanitizePhoneInput = (value: string) => {
  return sanitizeNumericInput(value, PHONE_LENGTH);
};

export const sanitizeAgeInput = (value: string) => {
  return sanitizeNumericInput(value, 3);
};

export const normalizeIdentifierInput = (value: string) => {
  return value.replace(/^\s+/, "");
};

export const isValidPhoneNumber = (value: string) => {
  return PHONE_REGEX.test(trimValue(value));
};

export const isValidEmail = (value: string) => {
  return EMAIL_REGEX.test(trimValue(value).toLowerCase());
};

export const isAllowedReportFileName = (value: string) => {
  if (!trimValue(value)) {
    return true;
  }

  return REPORT_FILE_REGEX.test(value);
};

export const validateRegisterForm = (form: RegisterFormValues) => {
  if (!trimValue(form.name) || !trimValue(form.phone) || !trimValue(form.fatherName)) {
    return "Please fill all required fields";
  }

  if (trimValue(form.name).length < 2 || trimValue(form.fatherName).length < 2) {
    return "Names must be at least 2 characters long";
  }

  if (!isValidPhoneNumber(form.phone)) {
    return "Phone number must be exactly 10 digits";
  }

  if (form.email && !isValidEmail(form.email)) {
    return "Please enter a valid email address";
  }

  if (form.age) {
    const age = Number(form.age);

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      return "Age must be a whole number between 1 and 120";
    }
  }

  if (form.password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (form.password !== form.confirm) {
    return "Passwords do not match";
  }

  return null;
};

export const validateUserLoginForm = (phone: string, password: string) => {
  if (!trimValue(phone) || !password) {
    return "Please enter phone number and password";
  }

  if (!isValidPhoneNumber(phone)) {
    return "Phone number must be exactly 10 digits";
  }

  return null;
};

export const validateAdminLoginForm = (identifier: string, password: string) => {
  const trimmedIdentifier = trimValue(identifier);

  if (!trimmedIdentifier || !password) {
    return "Please enter email or phone number and password";
  }

  if (
    !trimmedIdentifier.includes("@") &&
    !isValidPhoneNumber(trimmedIdentifier)
  ) {
    return "Admin login requires a valid 10-digit phone number or email address";
  }

  if (
    trimmedIdentifier.includes("@") &&
    !isValidEmail(trimmedIdentifier)
  ) {
    return "Please enter a valid admin email address";
  }

  return null;
};

export const validateApplicationForm = (form: ApplicationFormValues) => {
  if (!trimValue(form.problem) || !trimValue(form.details)) {
    return "Please fill all required fields";
  }

  if (trimValue(form.problem).length < 3) {
    return "Problem or symptoms must be at least 3 characters long";
  }

  if (trimValue(form.details).length < 10) {
    return "Medical issue details must be at least 10 characters long";
  }

  if (!isAllowedReportFileName(form.reportName)) {
    return "Medical report must be a PDF, JPG, JPEG, or PNG file";
  }

  return null;
};

export const prepareRegisterPayload = (form: RegisterFormValues) => {
  return {
    name: trimValue(form.name),
    phone: trimValue(form.phone),
    fatherName: trimValue(form.fatherName),
    email: trimValue(form.email),
    address: trimValue(form.address),
    age: trimValue(form.age),
    gender: trimValue(form.gender),
    password: form.password,
  };
};

export const prepareApplicationPayload = (form: ApplicationFormValues) => {
  return {
    problem: trimValue(form.problem),
    details: trimValue(form.details),
    previousTreatment: trimValue(form.previousTreatment),
    reportName: trimValue(form.reportName),
  };
};
