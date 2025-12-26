# Excel Import Template for Members

Use this template structure for importing members into the system.

## Required Columns

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| ID | String | Unique member identifier | MEM001 |
| DURATION | String | Plan duration description | 3 Month |
| AMOUNT | Number | Total amount paid | 299.99 |
| START_DATE | Date | Membership start date | 2025-01-01 |
| END_DATE | Date | Membership end date | 2025-04-01 |
| NAME | String | Member full name | John Doe |
| PHONE | String | Contact phone number | +1234567890 |

## Optional Columns

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| EMAIL | String | Email address | john@example.com |
| ADDRESS | String | Physical address | 123 Main St |
| EMERGENCY_CONTACT | String | Emergency contact info | Jane Doe +9876543210 |

## Important Notes

1. **File Format**: Use .xlsx or .xls format
2. **Column Headers**: Must match exactly (case-sensitive)
3. **Required Fields**: All required columns must have values
4. **Unique IDs**: Each ID must be unique in the system
5. **Date Format**: Use YYYY-MM-DD or Excel date format
6. **Amount**: Must be a valid number (no currency symbols)

## Sample Data

```
ID      | DURATION  | AMOUNT | START_DATE  | END_DATE    | NAME        | PHONE        | EMAIL
MEM001  | 1 Month   | 99.99  | 2025-01-01  | 2025-02-01  | John Doe    | +1234567890 | john@gym.com
MEM002  | 3 Month   | 249.99 | 2025-01-01  | 2025-04-01  | Jane Smith  | +1234567891 | jane@gym.com
MEM003  | 12 Month  | 899.99 | 2025-01-01  | 2026-01-01  | Bob Johnson | +1234567892 | bob@gym.com
```

## Import Process

1. Prepare your Excel file with the correct structure
2. Go to Admin Panel → Members
3. Click "Import Excel" button
4. Select your Excel file
5. Review import results

## Validation

The system will validate:
- All required columns are present
- All required fields have values
- IDs are unique (no duplicates)
- Dates are in valid format
- Amounts are valid numbers

## Error Handling

- Duplicate IDs will be skipped
- Invalid data will be logged with row number
- Import will continue even if some rows fail
- You'll receive a summary of success/failure counts
