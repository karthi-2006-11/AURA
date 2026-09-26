/**
 * Rule-based natural-language railway booking parser.
 *
 * Day 2 Implementation:
 * Parses basic natural-language booking requests into structured BookingRequest objects
 * using simple, readable TypeScript pattern-matching rules.
 */

import type { BookingRequest, Passenger, Quota, TravelClass } from '../models/index.js';

/**
 * Extracts travel class from user text.
 * Supports: 1A, 2A, 3A, 3AC -> 3A, SL, Sleeper -> SL, CC
 */
function extractTravelClass(text: string): TravelClass | undefined {
  if (/\b(3ac|3a)\b/i.test(text)) return '3A';
  if (/\b(2ac|2a)\b/i.test(text)) return '2A';
  if (/\b(1ac|1a)\b/i.test(text)) return '1A';
  if (/\b(sleeper|sl)\b/i.test(text)) return 'SL';
  if (/\b(cc|chair\s*car)\b/i.test(text)) return 'CC';
  return undefined;
}

/**
 * Extracts booking quota from user text.
 * Supports: Tatkal -> TATKAL, General -> GENERAL
 */
function extractQuota(text: string): Quota | undefined {
  if (/\btatkal\b/i.test(text)) return 'TATKAL';
  if (/\bgeneral\b/i.test(text)) return 'GENERAL';
  return undefined;
}

/**
 * Normalizes relative date keywords ("today", "tomorrow") to ISO format (YYYY-MM-DD).
 */
function extractTravelDate(text: string, baseDate: Date): string | undefined {
  const match = text.match(/\b(today|tomorrow)\b/i);
  if (!match) return undefined;

  const keyword = match[1].toLowerCase();
  const targetDate = new Date(baseDate);

  if (keyword === 'tomorrow') {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Extracts origin and destination stations using the "from X to Y" pattern.
 */
function extractRoute(text: string): { source?: string; destination?: string } {
  const routeRegex = /\bfrom\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?=\s+(?:today|tomorrow|for|on|in|with|\.|\,|$)|$)/i;
  const match = text.match(routeRegex);

  if (!match) return {};

  const source = match[1].trim();
  const destination = match[2].trim();

  return {
    source: source.length > 0 ? source : undefined,
    destination: destination.length > 0 ? destination : undefined,
  };
}

/**
 * Extracts passenger descriptions from common phrases:
 * - "me"
 * - "my father" / "father"
 * - "my mother" / "mother"
 * - "me and my father"
 * - "me and my mother"
 */
function extractPassengers(text: string): Passenger[] {
  // Focus on the passenger clause if introduced by "for"
  const forMatch = text.match(/\bfor\s+([^.\n]+)/i);
  const searchScope = forMatch ? forMatch[1] : text;

  const candidates: { name: string; index: number }[] = [];

  const meMatch = searchScope.match(/\bme\b/i);
  if (meMatch && meMatch.index !== undefined) {
    candidates.push({ name: 'me', index: meMatch.index });
  }

  const fatherMatch = searchScope.match(/\b(?:my\s+)?father\b/i);
  if (fatherMatch && fatherMatch.index !== undefined) {
    candidates.push({ name: 'father', index: fatherMatch.index });
  }

  const motherMatch = searchScope.match(/\b(?:my\s+)?mother\b/i);
  if (motherMatch && motherMatch.index !== undefined) {
    candidates.push({ name: 'mother', index: motherMatch.index });
  }

  // Preserve the order of appearance in the sentence
  candidates.sort((a, b) => a.index - b.index);

  return candidates.map((candidate) => ({ name: candidate.name }));
}

/**
 * Parses natural-language railway booking requests into structured BookingRequest objects.
 *
 * @param prompt The natural-language query provided by the user.
 * @param baseDate Optional reference date for date calculations (defaults to current date).
 * @returns A promise resolving to the structured BookingRequest.
 */
export async function parseBookingRequest(
  prompt: string,
  baseDate: Date = new Date()
): Promise<BookingRequest> {
  const route = extractRoute(prompt);
  const travelClass = extractTravelClass(prompt);
  const quota = extractQuota(prompt);
  const travelDate = extractTravelDate(prompt, baseDate);
  const passengers = extractPassengers(prompt);

  return {
    sourceStation: route.source,
    destinationStation: route.destination,
    travelDate,
    travelClass,
    quota,
    passengers,
    rawPrompt: prompt,
  };
}
