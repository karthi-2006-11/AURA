/**
 * AURA - AI Railway Booking Assistant
 * Day 4 Entrypoint - Integrated Pipeline Demo
 */

import { processBookingRequest } from './service/bookingService.js';

function printHeader(): void {
  console.log('='.repeat(70));
  console.log('   AURA - AI Railway Booking Assistant (Day 4 Integrated Pipeline)');
  console.log('='.repeat(70));
}

async function demonstrateDay4Pipeline(): Promise<void> {
  printHeader();

  console.log('\n[Pipeline Flow]');
  console.log('  Natural-language request');
  console.log('  -> parser (BookingRequest)');
  console.log('  -> validator (ValidationResult)\n');

  const testPrompts = [
    // 1. Complete and valid request
    'Book Tatkal 3AC from Chennai to Bangalore tomorrow for me and my father.',

    // 2. Incomplete request (missing class & passengers)
    'Train from Delhi to Mumbai tomorrow',

    // 3. Invalid request (identical source and destination)
    'Book 3A from Delhi to Delhi tomorrow for me',
  ];

  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    console.log(`[Case ${i + 1}] User Request: "${prompt}"`);

    const { request, validation } = await processBookingRequest(prompt);

    console.log('Parsed BookingRequest:');
    console.log(`  Source:       ${request.sourceStation ?? '(missing)'}`);
    console.log(`  Destination:  ${request.destinationStation ?? '(missing)'}`);
    console.log(`  Date:         ${request.travelDate ?? '(missing)'}`);
    console.log(`  Class:        ${request.travelClass ?? '(missing)'}`);
    console.log(`  Quota:        ${request.quota ?? 'N/A'}`);
    const passengerList =
      request.passengers.length > 0
        ? `[${request.passengers.map((p) => `"${p.name}"`).join(', ')}]`
        : '(none)';
    console.log(`  Passengers:   ${passengerList}`);

    console.log('Validation Result:');
    console.log(`  Status:       ${validation.isValid ? 'VALID' : 'INVALID'}`);
    if (!validation.isValid) {
      if (validation.missingFields.length > 0) {
        console.log(`  Missing:      ${validation.missingFields.join(', ')}`);
      }
      if (validation.errors.length > 0) {
        console.log(`  Errors:`);
        validation.errors.forEach((err) => console.log(`    - ${err}`));
      }
    }
    console.log('-'.repeat(70));
  }
}

demonstrateDay4Pipeline().catch(console.error);
