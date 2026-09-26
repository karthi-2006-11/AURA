/**
 * AURA - AI Railway Booking Assistant
 * Day 2 Entrypoint - Rule-Based Parser Demo
 */

import { parseBookingRequest } from './parser/index.js';

function printHeader(): void {
  console.log('='.repeat(65));
  console.log('   AURA - AI Railway Booking Assistant (Day 2 Parser)');
  console.log('='.repeat(65));
}

async function demonstrateDay2Parser(): Promise<void> {
  printHeader();

  console.log('\n[Status] Rule-based TypeScript parser active.');
  console.log('\n[Milestone 1 Target]');
  console.log('  Natural-language railway booking request');
  console.log('  -> structured booking information\n');

  const testPrompts = [
    'Book Tatkal 3AC from Chennai to Bangalore tomorrow for me and my father.',
    'Book Sleeper ticket from New Delhi to Mumbai today for my mother.',
    'Book General CC from Kolkata to Patna tomorrow for me and my mother.',
  ];

  for (const prompt of testPrompts) {
    console.log(`Prompt: "${prompt}"`);
    const parsed = await parseBookingRequest(prompt);
    console.log('Parsed BookingRequest:');
    console.log(`  Source:      ${parsed.sourceStation}`);
    console.log(`  Destination: ${parsed.destinationStation}`);
    console.log(`  Date:        ${parsed.travelDate}`);
    console.log(`  Class:       ${parsed.travelClass}`);
    console.log(`  Quota:       ${parsed.quota ?? 'N/A'}`);
    console.log(
      `  Passengers:  [${parsed.passengers.map((p) => `"${p.name}"`).join(', ')}]`
    );
    console.log('-'.repeat(65));
  }
}

demonstrateDay2Parser().catch(console.error);
