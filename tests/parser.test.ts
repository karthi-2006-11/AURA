import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseBookingRequest } from '../src/parser/index.js';

describe('AURA Day 2 Rule-Based Parser', () => {
  const fixedBaseDate = new Date('2026-10-10T10:00:00Z');

  it('should parse the primary example prompt accurately', async () => {
    const input = 'Book Tatkal 3AC from Chennai to Bangalore tomorrow for me and my father.';
    const result = await parseBookingRequest(input, fixedBaseDate);

    assert.strictEqual(result.sourceStation, 'Chennai');
    assert.strictEqual(result.destinationStation, 'Bangalore');
    assert.strictEqual(result.travelDate, '2026-10-11');
    assert.strictEqual(result.quota, 'TATKAL');
    assert.strictEqual(result.travelClass, '3A');
    assert.deepStrictEqual(
      result.passengers.map((p) => p.name),
      ['me', 'father']
    );
    assert.strictEqual(result.rawPrompt, input);
  });

  describe('Travel Class extraction', () => {
    it('should recognize 1A, 2A, 3A, 3AC, SL, Sleeper, CC', async () => {
      const cases = [
        { text: 'Book 1A from Delhi to Mumbai today', expected: '1A' },
        { text: 'Book 2A from Delhi to Mumbai today', expected: '2A' },
        { text: 'Book 3A from Delhi to Mumbai today', expected: '3A' },
        { text: 'Book 3AC from Delhi to Mumbai today', expected: '3A' },
        { text: 'Book SL from Delhi to Mumbai today', expected: 'SL' },
        { text: 'Book Sleeper from Delhi to Mumbai today', expected: 'SL' },
        { text: 'Book CC from Delhi to Mumbai today', expected: 'CC' },
      ];

      for (const c of cases) {
        const res = await parseBookingRequest(c.text, fixedBaseDate);
        assert.strictEqual(res.travelClass, c.expected, `Failed for input: ${c.text}`);
      }
    });
  });

  describe('Quota extraction', () => {
    it('should recognize Tatkal and General', async () => {
      const tatkalRes = await parseBookingRequest('Book Tatkal from Pune to Goa today', fixedBaseDate);
      assert.strictEqual(tatkalRes.quota, 'TATKAL');

      const generalRes = await parseBookingRequest('Book General ticket from Pune to Goa today', fixedBaseDate);
      assert.strictEqual(generalRes.quota, 'GENERAL');
    });
  });

  describe('Route extraction', () => {
    it('should extract source and destination from "from X to Y"', async () => {
      const res = await parseBookingRequest('Need ticket from New Delhi to Mumbai Central tomorrow', fixedBaseDate);
      assert.strictEqual(res.sourceStation, 'New Delhi');
      assert.strictEqual(res.destinationStation, 'Mumbai Central');
    });
  });

  describe('Passenger extraction', () => {
    it('should extract "me"', async () => {
      const res = await parseBookingRequest('Book SL from Delhi to Agra tomorrow for me', fixedBaseDate);
      assert.deepStrictEqual(res.passengers.map((p) => p.name), ['me']);
    });

    it('should extract "my father"', async () => {
      const res = await parseBookingRequest('Book SL from Delhi to Agra tomorrow for my father', fixedBaseDate);
      assert.deepStrictEqual(res.passengers.map((p) => p.name), ['father']);
    });

    it('should extract "my mother"', async () => {
      const res = await parseBookingRequest('Book SL from Delhi to Agra tomorrow for my mother', fixedBaseDate);
      assert.deepStrictEqual(res.passengers.map((p) => p.name), ['mother']);
    });

    it('should extract "me and my father"', async () => {
      const res = await parseBookingRequest('Book 2A from Jaipur to Delhi today for me and my father', fixedBaseDate);
      assert.deepStrictEqual(res.passengers.map((p) => p.name), ['me', 'father']);
    });

    it('should extract "me and my mother"', async () => {
      const res = await parseBookingRequest('Book CC from Mumbai to Pune today for me and my mother', fixedBaseDate);
      assert.deepStrictEqual(res.passengers.map((p) => p.name), ['me', 'mother']);
    });
  });

  describe('Date normalization', () => {
    it('should normalize "today" correctly', async () => {
      const res = await parseBookingRequest('Book 3A from Delhi to Pune today', fixedBaseDate);
      assert.strictEqual(res.travelDate, '2026-10-10');
    });

    it('should normalize "tomorrow" correctly', async () => {
      const res = await parseBookingRequest('Book 3A from Delhi to Pune tomorrow', fixedBaseDate);
      assert.strictEqual(res.travelDate, '2026-10-11');
    });
  });
});
