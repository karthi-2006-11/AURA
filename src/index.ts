/**
 * AURA - AI Railway Booking Assistant
 * Day 1 Foundation Entrypoint
 */

import type { BookingRequest } from './models/index.js';

function printHeader(): void {
  console.log('='.repeat(65));
  console.log('   AURA - AI Railway Booking Assistant (Day 1 Foundation)');
  console.log('='.repeat(65));
}

function demonstrateDay1Foundation(): void {
  printHeader();

  console.log('\n[Status] Project foundation initialized using TypeScript & Node.js.');
  console.log('\n[Milestone 1 Objective]');
  console.log('  Natural-language railway booking request');
  console.log('  -> structured booking information');

  // Preview of target structured booking schema
  const sampleBooking: BookingRequest = {
    sourceStation: 'New Delhi (NDLS)',
    destinationStation: 'Mumbai Central (MMCT)',
    travelDate: '2026-10-15',
    trainNumberOrName: 'Rajdhani Express',
    travelClass: '3A',
    quota: 'GENERAL',
    passengers: [
      {
        name: 'Rahul Sharma',
        age: 30,
        gender: 'M',
        berthPreference: 'LOWER',
      },
      {
        name: 'Priya Sharma',
        age: 28,
        gender: 'F',
        berthPreference: 'MIDDLE',
      },
    ],
    rawPrompt:
      'Book 2 tickets for Rahul (30M) and Priya (28F) in 3A Rajdhani from Delhi to Mumbai on 15th Oct',
  };

  console.log('\n[Preview] Target Structured Booking Data:');
  console.log(`  Source:      ${sampleBooking.sourceStation}`);
  console.log(`  Destination: ${sampleBooking.destinationStation}`);
  console.log(`  Date:        ${sampleBooking.travelDate}`);
  console.log(`  Train:       ${sampleBooking.trainNumberOrName}`);
  console.log(`  Class:       ${sampleBooking.travelClass}`);
  console.log(`  Quota:       ${sampleBooking.quota}`);
  console.log(`  Passengers (${sampleBooking.passengers.length}):`);
  sampleBooking.passengers.forEach((p) => {
    console.log(
      `    - ${p.name}, Age: ${p.age}, Gender: ${p.gender} (Berth: ${p.berthPreference})`
    );
  });

  console.log('\n[Note] Booking parser is intentionally NOT implemented yet for Day 1.');
  console.log('='.repeat(65));
}

demonstrateDay1Foundation();
