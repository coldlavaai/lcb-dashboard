#!/usr/bin/env node

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SPREADSHEET_ID = '1X2Q6NsHnnN6Q3iAxjg9jkZa__fEwCv9pF7yrTi-WDPU';

async function discoverSheet() {
  try {
    console.log('🔐 Authenticating...');

    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                            path.join(process.env.HOME, '.claude', 'google_service_account.json');

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('📊 Fetching spreadsheet metadata...\n');

    // Get spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const spreadsheet = response.data;

    console.log(`📋 Spreadsheet: "${spreadsheet.properties.title}"`);
    console.log(`\n📑 Found ${spreadsheet.sheets.length} sheet(s):\n`);

    spreadsheet.sheets.forEach((sheet, index) => {
      const props = sheet.properties;
      console.log(`${index + 1}. "${props.title}"`);
      console.log(`   - Sheet ID (gid): ${props.sheetId}`);
      console.log(`   - Type: ${props.sheetType}`);
      if (props.gridProperties) {
        console.log(`   - Grid size: ${props.gridProperties.rowCount} rows × ${props.gridProperties.columnCount} columns`);
      }
      console.log();
    });

    // Try to get a preview of the first sheet with data
    const firstDataSheet = spreadsheet.sheets.find(s => s.properties.sheetType === 'GRID');
    if (firstDataSheet) {
      const sheetName = firstDataSheet.properties.title;
      console.log(`\n📊 Fetching preview from "${sheetName}"...`);

      const previewResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Z10`, // First 10 rows, first 26 columns
      });

      const rows = previewResponse.data.values;
      if (rows && rows.length > 0) {
        console.log('\n📋 Headers (first row):');
        console.log(rows[0].join(' | '));
        console.log('\n📊 Sample data (row 2):');
        if (rows[1]) {
          console.log(rows[1].join(' | '));
        }
      }
    }

    console.log('\n✅ Discovery complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

discoverSheet();
