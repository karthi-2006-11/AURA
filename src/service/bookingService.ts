/**
 * Booking Service.
 *
 * Day 4 Implementation:
 * Connects natural-language parsing with booking request validation.
 */

import type { BookingRequest } from '../models/index.js';
import { parseBookingRequest } from '../parser/index.js';
import { validateBookingRequest, type ValidationResult } from '../validator/index.js';

/**
 * Result returned by the booking service pipeline.
 */
export interface ProcessedBookingRequest {
  request: BookingRequest;
  validation: ValidationResult;
}

/**
 * Processes a natural-language railway booking request through parsing and validation.
 *
 * @param prompt The natural-language query provided by the user.
 * @param baseDate Optional reference date for date calculations (defaults to current date).
 * @returns A promise resolving to the parsed BookingRequest and its ValidationResult.
 */
export async function processBookingRequest(
  prompt: string,
  baseDate: Date = new Date()
): Promise<ProcessedBookingRequest> {
  const request = await parseBookingRequest(prompt, baseDate);
  const validation = validateBookingRequest(request);

  return {
    request,
    validation,
  };
}
