import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { BookingRequest, Passenger } from '../src/models/index.js';
import { parseBookingRequest } from '../src/parser/index.js';

describe('AURA Day 1 Foundation Verification', () => {
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

  it('should confirm that the parser is not implemented yet', async () => {
    await assert.rejects(
      async () => {
        await parseBookingRequest('Book a train ticket');
      },
      {
        name: 'Error',
        message: /Booking parser is not implemented yet/,
      }
    );
  });
});
