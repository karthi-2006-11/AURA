/**
 * Data structures representing structured railway booking requests.
 *
 * Target milestone:
 * Natural-language railway booking request -> structured booking information
 */

export type TravelClass =
  | '1A'  // First AC
  | '2A'  // Second AC
  | '3A'  // Third AC
  | '3E'  // 3 AC Economy
  | 'SL'  // Sleeper
  | 'CC'  // AC Chair Car
  | 'EC'  // Executive Chair Car
  | '2S'  // Second Sitting
  | string;

export type Quota =
  | 'GENERAL'
  | 'TATKAL'
  | 'LADIES'
  | 'SENIOR_CITIZEN'
  | string;

export type Gender = 'M' | 'F' | 'Other';

export type BerthPreference =
  | 'LOWER'
  | 'MIDDLE'
  | 'UPPER'
  | 'SIDE_LOWER'
  | 'SIDE_UPPER'
  | 'WINDOW_SIDE'
  | 'NO_PREFERENCE';

export interface Passenger {
  name: string;
  age?: number;
  gender?: Gender;
  berthPreference?: BerthPreference;
}

export interface BookingRequest {
  sourceStation?: string;
  destinationStation?: string;
  travelDate?: string; // Expected format: YYYY-MM-DD
  trainNumberOrName?: string;
  travelClass?: TravelClass;
  quota?: Quota;
  passengers: Passenger[];
  rawPrompt?: string;
}
