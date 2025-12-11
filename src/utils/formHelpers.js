import { z } from 'zod';

// ------------------------------
// SIMPLE HELPERS
// ------------------------------
export const requiredField = (label) => z.string().min(1, `${label} is required`);

export const passwordField = requiredField('Password').min(
  6,
  'Password must be at least 6 characters',
);

export const requiredDateField = (label) =>
  z
    .union([z.coerce.date(), z.null(), z.undefined()])
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: `${label} is required`,
    });

// optional date field
export const optionalDateField = (label) =>
  z
    .union([z.date(), z.null(), z.undefined()])
    .refine((val) => val === null || val === undefined || val instanceof Date, {
      message: `${label} must be a valid date`,
    })
    .optional();

// ------------------------------
// UNIVERSAL SCHEMA BUILDER
// ------------------------------
export const buildSchema = (fields) => {
  const shape = {};

  for (const key in fields) {
    const config = fields[key];

    const fieldConfig = typeof config === 'string' ? { label: config } : config;
    const { label, min, max, email, regex, regexMessage, required } = fieldConfig;

    const isRequired = required === true || typeof config === 'string';

    let schema = z.string();

    if (min) {
      schema = schema.min(min, `${label} must be at least ${min} characters`);
    }

    if (max) {
      schema = schema.max(max, `${label} must be at most ${max} characters`);
    }

    // Format rules
    if (email) {
      schema = schema.email(`${label} must be a valid email`);
    }

    if (regex) {
      schema = schema.regex(regex, regexMessage || 'Invalid format');
    }

    if (isRequired) {
      schema = schema.min(1, `${label} is required`);
    } else {
      schema = schema.or(z.literal('')).optional();
    }

    shape[key] = schema;
  }

  return z.object(shape);
};

export const validateTwoDecimal = (value) => {
  if (!value) return '';

  // Allow only numbers with max 2 decimals
  const regex = /^\d+(\.\d{0,2})?$/;
  if (regex.test(value)) return value;

  // If user exceeds decimals
  if (value.includes('.')) {
    const [int, dec] = value.split('.');
    return int + '.' + dec.slice(0, 2);
  }

  // remove invalid chars
  return value.replace(/[^\d.]/g, '');
};

export function parseCurrencyList(raw) {
  if (!raw || typeof raw !== 'string') return [];

  return raw
    .split('|')
    .filter(Boolean)
    .map((item) => {
      const [code, name] = item.split('#');
      return {
        code: code || '',
        name: name || '',
        label: name || '',
        value: code || '',
      };
    });
}
