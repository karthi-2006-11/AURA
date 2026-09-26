import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { BookingRequest } from '../src/models/index.js';
import { validateBookingRequest } from '../src/validator/index.js';

describe('AURA Day 3 BookingRequest Validator', () => {
  const createValidBooking = (): BookingRequest => ({
    sourceStation: 'Chennai',
    destinationStation: 'Bangalore',
    travelDate: '2026-10-15',
    travelClass: '3A',
    quota: 'TATKAL',
    passengers: [{ name: 'me' }, { name: 'father' }],
    rawPrompt: 'Book Tatkal 3AC from Chennai to Bangalore tomorrow for me and my father.',
  });

  it('1. should validate a completely valid booking request', () => {
    const booking = createValidBooking();
    const result = validateBookingRequest(booking);

    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.missingFields, []);
    assert.deepStrictEqual(result.errors, []);
  });

  it('2. should flag missing source station', () => {
    const booking = createValidBooking();
    booking.sourceStation = undefined;

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.missingFields.includes('sourceStation'));
    assert.ok(result.errors.some((e) => e.includes('sourceStation')));
  });

  it('3. should flag missing destination station', () => {
    const booking = createValidBooking();
    booking.destinationStation = '   ';

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.missingFields.includes('destinationStation'));
    assert.ok(result.errors.some((e) => e.includes('destinationStation')));
  });

  it('4. should flag missing travel date', () => {
    const booking = createValidBooking();
    booking.travelDate = undefined;

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.missingFields.includes('travelDate'));
  });

  it('5. should flag missing travel class', () => {
    const booking = createValidBooking();
    booking.travelClass = undefined;

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.missingFields.includes('travelClass'));
  });

  it('6. should flag empty passenger list', () => {
    const booking = createValidBooking();
    booking.passengers = [];

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.missingFields.includes('passengers'));
    assert.ok(result.errors.some((e) => e.includes('At least one passenger')));
  });

  it('7. should flag empty passenger name', () => {
    const booking = createValidBooking();
    booking.passengers = [{ name: '  ' }];

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some((e) => e.includes('non-empty name or description')));
  });

  it('8. should flag identical source and destination stations (case-insensitive and trimmed)', () => {
    const booking = createValidBooking();
    booking.sourceStation = '  Chennai ';
    booking.destinationStation = 'chennai';

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, false);
    assert.ok(
      result.errors.some((e) => e.includes('cannot be identical'))
    );
  });

  it('9. should flag invalid calendar dates', () => {
    const invalidDates = ['2026-02-31', '2026-13-01', 'not-a-date', '2026/10/15'];

    for (const date of invalidDates) {
      const booking = createValidBooking();
      booking.travelDate = date;

      const result = validateBookingRequest(booking);
      assert.strictEqual(result.isValid, false, `Failed for date: ${date}`);
      assert.ok(
        result.errors.some((e) => e.includes('real calendar date')),
        `Expected error message for date: ${date}`
      );
    }
  });

  it('10. should treat missing quota as valid when all required fields exist', () => {
    const booking = createValidBooking();
    booking.quota = undefined;

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(booking.quota, undefined); // ensures quota was not defaulted
    assert.deepStrictEqual(result.missingFields, []);
    assert.deepStrictEqual(result.errors, []);
  });

  it('11. should accept "me" and "father" (and "mother") as valid passenger descriptions', () => {
    const booking = createValidBooking();
    booking.passengers = [{ name: 'me' }, { name: 'father' }, { name: 'mother' }];

    const result = validateBookingRequest(booking);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.missingFields, []);
    assert.deepStrictEqual(result.errors, []);
  });
});
