import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { BookingRequest, Passenger } from '../src/models/index.js';
import { parseBookingRequest } from '../src/parser/index.js';

describe('AURA Foundation Verification', () => {
  it('should instantiate structured passenger and booking objects properly', () => {
    const passenger: Passenger = {
      name: 'Ananya Verma',
      age: 26,
      gender: 'F',
      berthPreference: 'LOWER',
    };

    const booking: BookingRequest = {
      sourceStation: 'SBC',
      destinationStation: 'MAS',
      travelDate: '2026-11-20',
      travelClass: '2A',
      quota: 'GENERAL',
      passengers: [passenger],
    };

    assert.strictEqual(booking.sourceStation, 'SBC');
    assert.strictEqual(booking.destinationStation, 'MAS');
    assert.strictEqual(booking.passengers.length, 1);
    assert.strictEqual(booking.passengers[0].name, 'Ananya Verma');
  });

  it('should return a structured BookingRequest from the parser', async () => {
    const result = await parseBookingRequest('Book 3A from Chennai to Bangalore tomorrow for me');
    assert.ok(result);
    assert.strictEqual(result.sourceStation, 'Chennai');
    assert.strictEqual(result.destinationStation, 'Bangalore');
    assert.strictEqual(result.travelClass, '3A');
  });
});
