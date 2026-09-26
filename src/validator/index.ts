/**
 * Booking Request Validator.
 *
 * Day 3 Implementation:
 * Validates structured BookingRequest objects against Milestone 1 railway booking rules.
 */

import type { BookingRequest } from '../models/index.js';

/**
 * Names of fields that are mandatory for a complete booking request.
 */
export type RequiredBookingField =
  | 'sourceStation'
  | 'destinationStation'
  | 'travelDate'
  | 'travelClass'
  | 'passengers';

/**
 * Result structure returned after validating a BookingRequest.
 */
export interface ValidationResult {
  /** True if all required fields are present and valid with no semantic errors */
  isValid: boolean;

  /** List of required field keys that were missing or empty */
  missingFields: RequiredBookingField[];

  /** Human-readable error messages explaining any missing fields or semantic issues */
  errors: string[];
}

/**
 * Validates whether a given string is in YYYY-MM-DD format and represents a real calendar date.
 */
function isValidCalendarDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Use UTC to prevent local timezone shifts
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Validates a BookingRequest according to approved Day 3 rules.
 *
 * @param request The structured booking request to validate.
 * @returns A ValidationResult indicating validity, missing fields, and error messages.
 */
export function validateBookingRequest(request: BookingRequest): ValidationResult {
  const missingFields: RequiredBookingField[] = [];
  const errors: string[] = [];

  // 1. sourceStation validation
  if (!request.sourceStation || request.sourceStation.trim() === '') {
    missingFields.push('sourceStation');
    errors.push('Missing required field: sourceStation.');
  }

  // 2. destinationStation validation
  if (!request.destinationStation || request.destinationStation.trim() === '') {
    missingFields.push('destinationStation');
    errors.push('Missing required field: destinationStation.');
  }

  // 3. Different stations check
  if (
    request.sourceStation &&
    request.destinationStation &&
    request.sourceStation.trim() !== '' &&
    request.destinationStation.trim() !== ''
  ) {
    if (
      request.sourceStation.trim().toLowerCase() ===
      request.destinationStation.trim().toLowerCase()
    ) {
      errors.push('Source and destination stations cannot be identical.');
    }
  }

  // 4. travelDate validation
  if (!request.travelDate || request.travelDate.trim() === '') {
    missingFields.push('travelDate');
    errors.push('Missing required field: travelDate.');
  } else if (!isValidCalendarDate(request.travelDate.trim())) {
    errors.push('travelDate must match YYYY-MM-DD and represent a real calendar date.');
  }

  // 5. travelClass validation
  if (!request.travelClass || request.travelClass.trim() === '') {
    missingFields.push('travelClass');
    errors.push('Missing required field: travelClass.');
  }

  // 6. Passengers validation
  if (!request.passengers || request.passengers.length === 0) {
    missingFields.push('passengers');
    errors.push('At least one passenger must be provided.');
  } else {
    request.passengers.forEach((passenger, index) => {
      if (!passenger.name || passenger.name.trim() === '') {
        errors.push(`Passenger at index ${index} must have a non-empty name or description.`);
      }
    });
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
  };
}
