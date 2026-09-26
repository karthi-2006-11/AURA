import { describe, it } from 'node:test';
import assert from 'node:assert';
import { processBookingRequest } from '../src/service/bookingService.js';

describe('AURA Day 4 Booking Service Pipeline', () => {
  const fixedBaseDate = new Date('2026-10-15T10:00:00Z');

  it('1. should process a complete valid natural-language request', async () => {
    const prompt = 'Book Tatkal 3AC from Chennai to Bangalore tomorrow for me and my father.';
    const result = await processBookingRequest(prompt, fixedBaseDate);

    // Verify parsed BookingRequest
    assert.strictEqual(result.request.sourceStation, 'Chennai');
    assert.strictEqual(result.request.destinationStation, 'Bangalore');
    assert.strictEqual(result.request.travelDate, '2026-10-16');
    assert.strictEqual(result.request.travelClass, '3A');
    assert.strictEqual(result.request.quota, 'TATKAL');
    assert.deepStrictEqual(
      result.request.passengers.map((p) => p.name),
      ['me', 'father']
    );
    assert.strictEqual(result.request.rawPrompt, prompt);

    // Verify ValidationResult
    assert.strictEqual(result.validation.isValid, true);
    assert.deepStrictEqual(result.validation.missingFields, []);
    assert.deepStrictEqual(result.validation.errors, []);
  });

  it('2. should process an incomplete request missing class and passengers', async () => {
    const prompt = 'Train from Delhi to Mumbai tomorrow';
    const result = await processBookingRequest(prompt, fixedBaseDate);

    // Verify parsed BookingRequest
    assert.strictEqual(result.request.sourceStation, 'Delhi');
    assert.strictEqual(result.request.destinationStation, 'Mumbai');
    assert.strictEqual(result.request.travelDate, '2026-10-16');
    assert.strictEqual(result.request.travelClass, undefined);
    assert.deepStrictEqual(result.request.passengers, []);

    // Verify ValidationResult
    assert.strictEqual(result.validation.isValid, false);
    assert.ok(result.validation.missingFields.includes('travelClass'));
    assert.ok(result.validation.missingFields.includes('passengers'));
    assert.ok(result.validation.errors.some((e) => e.includes('travelClass')));
    assert.ok(result.validation.errors.some((e) => e.includes('At least one passenger')));
  });

  it('3. should process an invalid request with identical source and destination', async () => {
    const prompt = 'Book 3A from Delhi to Delhi tomorrow for me';
    const result = await processBookingRequest(prompt, fixedBaseDate);

    // Verify parsed BookingRequest
    assert.strictEqual(result.request.sourceStation, 'Delhi');
    assert.strictEqual(result.request.destinationStation, 'Delhi');
    assert.strictEqual(result.request.travelClass, '3A');
    assert.strictEqual(result.request.travelDate, '2026-10-16');
    assert.deepStrictEqual(
      result.request.passengers.map((p) => p.name),
      ['me']
    );

    // Verify ValidationResult
    assert.strictEqual(result.validation.isValid, false);
    assert.ok(
      result.validation.errors.some((e) => e.includes('cannot be identical'))
    );
  });
});
