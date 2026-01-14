import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';
import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    // Server-side authorization check
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file');
    const yearParam = formData.get('year');
    const baseYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (isNaN(baseYear) || baseYear < 2000 || baseYear > 2100) {
      return NextResponse.json(
        { error: 'Invalid year provided' },
        { status: 400 }
      );
    }

    // Read the file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // First, try to detect if there are headers by reading as objects
    const dataWithHeaders = XLSX.utils.sheet_to_json(worksheet);
    
    if (dataWithHeaders.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }
    
    // Check if first row looks like headers
    const firstRow = dataWithHeaders[0];
    const firstRowKeys = Object.keys(firstRow);
    const likelyHeaders = ['ID', 'DURATION', 'AMOUNT', 'START_DATE', 'END_DATE', 'NAME', 'PHONE'];
    const hasHeaders = likelyHeaders.some(header => 
      firstRowKeys.some(key => key.toUpperCase() === header)
    );
    
    let data;
    if (hasHeaders) {
      // Use the object format (keys are column names)
      data = dataWithHeaders;
    } else {
      // No headers detected - read as array format
      data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Filter out empty rows
      data = data.filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== ''));
      
      if (data.length === 0) {
        return NextResponse.json(
          { error: 'Excel file is empty' },
          { status: 400 }
        );
      }
    }

    const { databases } = createAdminClient();
    
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      duplicates: 0
    };

    let columnMap = {};
    let startIndex = 0;
    
    if (hasHeaders) {
      // First row is headers - create mapping from object keys
      const firstDataRow = data[0];
      Object.keys(firstDataRow).forEach(key => {
        columnMap[key.toUpperCase()] = key;
      });
      startIndex = 0;
    } else {
      // No headers - data is array format
      // Each row is [col0, col1, col2, ...]
      // Map by index: 0=ID, 1=DURATION, 2=AMOUNT, etc.
      columnMap = {
        'ID': 0,
        'DURATION': 1,
        'AMOUNT': 2,
        'START_DATE': 3,
        'END_DATE': 4,
        'NAME': 5,
        'PHONE': 6,
        'EMAIL': 7,
        'ADDRESS': 8,
        'EMERGENCY_CONTACT': 9
      };
      startIndex = 0;
    }

    // Process each row
    for (let i = startIndex; i < data.length; i++) {
      const row = data[i];
      
      let rowData;
      if (hasHeaders) {
        // Access by column name
        rowData = {
          ID: row[columnMap['ID']],
          DURATION: row[columnMap['DURATION']],
          AMOUNT: row[columnMap['AMOUNT']],
          START_DATE: row[columnMap['START_DATE']],
          END_DATE: row[columnMap['END_DATE']],
          NAME: row[columnMap['NAME']],
          PHONE: row[columnMap['PHONE']],
          EMAIL: row[columnMap['EMAIL']],
          ADDRESS: row[columnMap['ADDRESS']],
          EMERGENCY_CONTACT: row[columnMap['EMERGENCY_CONTACT']]
        };
      } else {
        // Access by array index
        rowData = {
          ID: row[0],
          DURATION: row[1],
          AMOUNT: row[2],
          START_DATE: row[3],
          END_DATE: row[4],
          NAME: row[5],
          PHONE: row[6],
          EMAIL: row[7],
          ADDRESS: row[8],
          EMERGENCY_CONTACT: row[9]
        };
      }
      
      try {
        // Validate required fields (allow empty strings to be caught)
        if (!rowData.ID || !rowData.NAME || !rowData.DURATION || !rowData.AMOUNT || !rowData.START_DATE) {
          results.failed++;
          results.errors.push({
            row: i + 2, // +2 because Excel rows start at 1 and we have header
            error: 'Missing required fields (ID, NAME, DURATION, AMOUNT, START_DATE are required)'
          });
          continue;
        }

        // Check for duplicate ID
        const existingMembers = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          [Query.equal('memberId', String(rowData.ID))]
        );

        if (existingMembers.documents.length > 0) {
          results.duplicates++;
          results.errors.push({
            row: i + 2,
            error: `Member with ID ${rowData.ID} already exists`
          });
          continue;
        }

        // Parse dates with support for multiple formats
        let startDate;
        let endDate;
        
        // Helper function to parse various date formats
        const parseDate = (dateValue) => {
          if (!dateValue || dateValue === '') return null;
          
          // Handle Excel date serial numbers
          if (typeof dateValue === 'number') {
            try {
              const parsed = XLSX.SSF.parse_date_code(dateValue);
              if (!parsed) return null;
              // Use baseYear and ignore the year from Excel serial
              return new Date(baseYear, parsed.m - 1, parsed.d, 12, 0, 0, 0);
            } catch (e) {
              return null;
            }
          }
          
          const dateStr = String(dateValue).trim();
          if (!dateStr) return null;
          
          // Handle French month abbreviations (e.g., "04-août", "05-sept")
          const frenchMonths = {
            'janv': 0, 'janvier': 0, 'jan': 0,
            'févr': 1, 'fév': 1, 'fevr': 1, 'fev': 1, 'février': 1, 'fevrier': 1, 'feb': 1,
            'mars': 2, 'mar': 2,
            'avr': 3, 'avril': 3, 'apr': 3,
            'mai': 4, 'may': 4,
            'juin': 5, 'jun': 5,
            'juil': 6, 'juillet': 6, 'jul': 6,
            'août': 7, 'aout': 7, 'aug': 7, 'aoû': 7,
            'sept': 8, 'septembre': 8, 'sep': 8,
            'oct': 9, 'octobre': 9,
            'nov': 10, 'novembre': 10,
            'déc': 11, 'dec': 11, 'décembre': 11, 'decembre': 11
          };
          
          // Parse "DD-month" or "DD-MONTH" format (e.g., "04-août")
          const frenchMatch = dateStr.match(/^(\d{1,2})[-\/\s]([a-zéèêàâûùïî]+)$/i);
          if (frenchMatch) {
            const day = parseInt(frenchMatch[1]);
            const monthName = frenchMatch[2].toLowerCase();
            const month = frenchMonths[monthName];
            
            if (month !== undefined && day >= 1 && day <= 31) {
              // Use the year provided by admin, set time to noon to avoid timezone issues
              return new Date(baseYear, month, day, 12, 0, 0, 0);
            }
          }
          
          // Parse "DD/MM" or "DD-MM" format (without year) - use baseYear
          const dm = dateStr.match(/^(\d{1,2})[-\/](\d{1,2})$/);
          if (dm) {
            const day = parseInt(dm[1]);
            const month = parseInt(dm[2]) - 1;
            return new Date(baseYear, month, day, 12, 0, 0, 0);
          }
          
          // Parse "DD/MM/YYYY" or "DD-MM-YYYY" format
          const dmy = dateStr.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/);
          if (dmy) {
            const day = parseInt(dmy[1]);
            const month = parseInt(dmy[2]) - 1;
            let year = parseInt(dmy[3]);
            if (year < 100) year += 2000;
            return new Date(year, month, day, 12, 0, 0, 0);
          }
          
          // Try to parse as standard date string and extract components with baseYear
          const tempDate = new Date(dateStr);
          if (!isNaN(tempDate.getTime())) {
            // Valid date, but use baseYear instead of parsed year
            return new Date(baseYear, tempDate.getMonth(), tempDate.getDate(), 12, 0, 0, 0);
          }
          
          return null;
        };
        
        try {
          startDate = parseDate(rowData.START_DATE);
          endDate = rowData.END_DATE ? parseDate(rowData.END_DATE) : null;

          if (!startDate || isNaN(startDate.getTime())) {
            throw new Error(`Invalid START_DATE format: "${rowData.START_DATE}"`);
          }
          
          // If no end date provided, calculate based on duration
          if (!endDate || isNaN(endDate.getTime())) {
            // Default to 1 month if duration parsing fails
            const durationMatch = String(rowData.DURATION).match(/(\d+)\s*mois/i);
            const months = durationMatch ? parseInt(durationMatch[1]) : 1;
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + months);
          }
        } catch (dateError) {
          results.failed++;
          results.errors.push({
            row: i + 2,
            error: dateError.message || 'Invalid date format'
          });
          continue;
        }

        // Validate amount is a number
        const amount = parseFloat(rowData.AMOUNT);
        if (isNaN(amount)) {
          results.failed++;
          results.errors.push({
            row: i + 2,
            error: 'Invalid amount - must be a number'
          });
          continue;
        }

        // Determine status based on end date
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of day for comparison
        const status = endDate.getTime() >= now.getTime() ? 'Active' : 'Expired';

        // Create member document
        const memberData = {
          memberId: String(rowData.ID),
          name: String(rowData.NAME),
          phone: String(rowData.PHONE || 'N/A'),
          email: rowData.EMAIL || `member${rowData.ID}@gym.com`, // Optional, generate if not provided
          planId: 'imported_plan',
          planName: `${rowData.DURATION}`,
          subscriptionStartDate: startDate.toISOString(),
          subscriptionEndDate: endDate.toISOString(),
          status: status,
          totalPaid: amount,
          address: rowData.ADDRESS || '',
          emergencyContact: rowData.EMERGENCY_CONTACT || '',
          hasAssurance: false,
          assuranceAmount: 0
        };

        const member = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          ID.unique(),
          memberData
        );

        // Create payment record for the imported member
        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.paymentsCollectionId,
            ID.unique(),
            {
              memberId: String(rowData.ID),
              memberName: String(rowData.NAME),
              planId: 'imported_plan',
              planName: `${rowData.DURATION}`,
              amount: amount,
              paymentDate: startDate.toISOString(),
              paymentMethod: 'Cash',
              status: 'Completed',
              notes: 'Imported from Excel',
            }
          );
        } catch (paymentError) {
          console.error(`Failed to create payment for member ${rowData.ID}:`, paymentError.message);
          // Continue even if payment creation fails
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      results: {
        total: data.length,
        success: results.success,
        failed: results.failed,
        duplicates: results.duplicates,
        errors: results.errors.slice(0, 20) // Show up to 20 error details
      }
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
