#!/usr/bin/env node

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheets configuration
const SPREADSHEET_ID = '1X2Q6NsHnnN6Q3iAxjg9jkZa__fEwCv9pF7yrTi-WDPU';
const SHEET_NAME = 'All'; // Main data sheet
const RANGE = 'A:BT'; // Get all 70 columns (A-BT)

async function importGoogleSheet() {
  try {
    console.log('🔐 Authenticating with Google Sheets API...');

    // Load service account credentials
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                            path.join(process.env.HOME, '.claude', 'google_service_account.json');

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Service account credentials not found at: ${credentialsPath}`);
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Authenticate
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('📊 Fetching data from Google Sheet...');
    console.log(`   Sheet ID: ${SPREADSHEET_ID}`);
    console.log(`   Range: ${SHEET_NAME}!${RANGE}`);

    // Fetch the data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${RANGE}`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      throw new Error('No data found in sheet');
    }

    console.log(`✅ Fetched ${rows.length} rows`);

    // First row might be averages, second row is likely headers
    // Let's check the first few rows to find the header row
    console.log('🔍 First few rows:');
    rows.slice(0, 5).forEach((row, i) => {
      console.log(`   Row ${i + 1}:`, row.slice(0, 10).join(' | '));
    });

    // Look for the row with "Date" in first column
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      if (rows[i][0] && rows[i][0].toString().toLowerCase().includes('date')) {
        headerRowIndex = i;
        break;
      }
      // Also check if it has "MY" in second column (Marketing Year)
      if (rows[i][1] && rows[i][1].toString() === 'MY') {
        headerRowIndex = i;
        break;
      }
    }

    const headers = rows[headerRowIndex];

    // Fix empty first column - it should be "Date"
    if (!headers[0] || headers[0].trim() === '') {
      headers[0] = 'Date';
      console.log('✅ Fixed empty first column header to "Date"');
    }

    console.log(`\n📋 Using row ${headerRowIndex + 1} as headers`);
    console.log(`📋 Found ${headers.length} columns:`, headers.slice(0, 15).join(', '), '...');

    // Convert to JSON
    console.log('🔄 Converting to JSON...');
    const data = [];

    for (let i = headerRowIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      const obj = {};

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        let value = row[j];

        // Skip empty headers
        if (!header || header.trim() === '') continue;

        // Convert empty strings to null
        if (value === '' || value === undefined) {
          value = null;
        }
        // Skip Excel error values
        else if (typeof value === 'string' && (value.includes('#DIV/0!') || value.includes('#N/A') || value.includes('#REF!'))) {
          value = null;
        }
        // Handle dates (DD/MM/YYYY format)
        else if (header === 'Date' && typeof value === 'string' && value.includes('/')) {
          // Convert DD/MM/YYYY to YYYY-MM-DD
          const parts = value.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            value = `${year}-${month}-${day}`;
          }
        }
        // Try to parse as number if it looks numeric
        else if (typeof value === 'string' && value.trim() !== '') {
          const trimmed = value.trim();
          // Check if it's a number (including negative numbers and decimals)
          if (/^-?\d+\.?\d*$/.test(trimmed)) {
            const num = parseFloat(trimmed);
            if (!isNaN(num)) {
              value = num;
            }
          }
        }

        obj[header] = value;
      }

      // Only add rows that have a date
      if (obj.Date && obj.Date !== null) {
        data.push(obj);
      }
    }

    console.log(`✅ Converted ${data.length} records`);

    // Get date range
    const firstDate = data[0]?.Date;
    const lastDate = data[data.length - 1]?.Date;
    console.log(`📅 Date range: ${firstDate} to ${lastDate}`);

    // Write to JSON files
    const outputPath = path.join(__dirname, '..', 'app', 'data', 'cotton_data.json');
    const outputPathFull = path.join(__dirname, '..', 'app', 'data', 'cotton_data_full.json');

    console.log('💾 Writing to files...');

    // Write full data (sorted most recent first)
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ Wrote ${data.length} records to cotton_data.json`);

    // Also update the full data file
    fs.writeFileSync(outputPathFull, JSON.stringify(data, null, 2));
    console.log(`✅ Wrote ${data.length} records to cotton_data_full.json`);

    // Show some sample data
    console.log('\n📊 Sample record (most recent):');
    console.log(JSON.stringify(data[0], null, 2).substring(0, 500) + '...');

    console.log('\n✅ Import complete!');
    console.log(`   Total records: ${data.length}`);
    console.log(`   Date range: ${firstDate} to ${lastDate}`);
    console.log(`   Files updated: cotton_data.json, cotton_data_full.json`);

  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the import
importGoogleSheet();
