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
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      duplicates: 0
    };

    // Validate column names from first row
    const firstRow = data[0];
    const requiredColumns = ['ID', 'DURATION', 'AMOUNT', 'START_DATE', 'END_DATE', 'NAME', 'PHONE'];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      );
    }

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Validate required fields
        if (!row.ID || !row.NAME || !row.PHONE || !row.DURATION || !row.AMOUNT || !row.START_DATE || !row.END_DATE) {
          results.failed++;
          results.errors.push({
            row: i + 2, // +2 because Excel rows start at 1 and we have header
            error: 'Missing required fields'
          });
          continue;
        }

        // Check for duplicate ID
        const existingMembers = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          [Query.equal('memberId', String(row.ID))]
        );

        if (existingMembers.documents.length > 0) {
          results.duplicates++;
          results.errors.push({
            row: i + 2,
            error: `Member with ID ${row.ID} already exists`
          });
          continue;
        }

        // Parse dates with support for multiple formats
        let startDate;
        let endDate;
        
        // Helper function to parse various date formats
        const parseDate = (dateValue) => {
          if (!dateValue) return null;
          
          // Handle Excel date serial numbers
          if (typeof dateValue === 'number') {
            const parsed = XLSX.SSF.parse_date_code(dateValue);
            // Use baseYear and ignore the year from Excel serial
            return new Date(baseYear, parsed.m - 1, parsed.d, 12, 0, 0, 0);
          }
          
          const dateStr = String(dateValue).trim();
          
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
          startDate = parseDate(row.START_DATE);
          endDate = parseDate(row.END_DATE);

          if (!startDate || isNaN(startDate.getTime())) {
            throw new Error(`Invalid START_DATE format: "${row.START_DATE}"`);
          }
          
          if (!endDate || isNaN(endDate.getTime())) {
            throw new Error(`Invalid END_DATE format: "${row.END_DATE}"`);
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
        const amount = parseFloat(row.AMOUNT);
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
          memberId: String(row.ID),
          name: String(row.NAME),
          phone: String(row.PHONE),
          email: row.EMAIL || `member${row.ID}@gym.com`, // Optional, generate if not provided
          planId: 'imported_plan',
          planName: `${row.DURATION}`,
          subscriptionStartDate: startDate.toISOString(),
          subscriptionEndDate: endDate.toISOString(),
          status: status,
          totalPaid: amount,
          address: row.ADDRESS || '',
          emergencyContact: row.EMERGENCY_CONTACT || ''
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
              memberId: String(row.ID),
              memberName: String(row.NAME),
              planId: 'imported_plan',
              planName: `${row.DURATION}`,
              amount: amount,
              paymentDate: startDate.toISOString(),
              paymentMethod: 'Cash',
              status: 'Completed',
              notes: 'Imported from Excel',
            }
          );
        } catch (paymentError) {
          console.error(`Failed to create payment for member ${row.ID}:`, paymentError.message);
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
