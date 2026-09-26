/**
 * Natural language booking parser placeholder.
 *
 * NOTE: As per Day 1 instructions, parser implementation is intentionally omitted.
 * This module will be developed in the upcoming milestone to convert natural
 * language prompts into structured BookingRequest objects.
 */

import type { BookingRequest } from '../models/index.js';

/**
 * Parses natural-language railway booking text into structured booking information.
 *
 * @param _prompt The natural-language query provided by the user.
 * @returns A promise that resolves to a structured BookingRequest.
 */
export async function parseBookingRequest(_prompt: string): Promise<BookingRequest> {
  throw new Error(
    'Booking parser is not implemented yet. This will be built in the upcoming milestone.'
  );
}
