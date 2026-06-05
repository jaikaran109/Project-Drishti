const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const REPORT_FILE_REGEX = /\.(pdf|png|jpe?g)$/i;

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const normalizePhone = (value) => {
  const normalizedValue = normalizeString(value)?.replace(/\s+/g, "");

  if (!normalizedValue) {
    return undefined;
  }

  return PHONE_REGEX.test(normalizedValue) ? normalizedValue : null;
};

const normalizeEmail = (value) => {
  const normalizedValue = normalizeString(value)?.toLowerCase();

  if (!normalizedValue) {
    return undefined;
  }

  return EMAIL_REGEX.test(normalizedValue) ? normalizedValue : null;
};

const normalizeAge = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedAge = Number(value);

  if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
    return null;
  }

  return parsedAge;
};

const isValidDateInput = (value) => {
  return typeof value === "string" && DATE_REGEX.test(value);
};

const isValidTimeInput = (value) => {
  return typeof value === "string" && TIME_REGEX.test(value);
};

const isAllowedReportName = (value) => {
  if (!value) {
    return true;
  }

  return REPORT_FILE_REGEX.test(value);
};

module.exports = {
  normalizeString,
  normalizePhone,
  normalizeEmail,
  normalizeAge,
  isValidDateInput,
  isValidTimeInput,
  isAllowedReportName,
};
