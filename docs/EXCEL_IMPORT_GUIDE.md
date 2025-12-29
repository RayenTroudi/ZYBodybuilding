# Excel Import Template for Members

Use this template structure for importing members into the system.

## Column Order (No Headers Required!)

The system automatically detects your data. You can either:
1. **Use headers** (recommended) - First row with column names
2. **No headers** - Data starts from first row, columns must be in this order:

| Position | Column | Type | Required | Description | Example |
|----------|--------|------|----------|-------------|---------|
| 1 | ID | String | ✅ Yes | Unique member identifier | AD105, MEM001 |
| 2 | DURATION | String | ✅ Yes | Plan duration | 1MOIS, 3 Month |
| 3 | AMOUNT | Number | ✅ Yes | Total amount paid | 100, 299.99 |
| 4 | START_DATE | Date | ✅ Yes | Membership start date | 04-août, 2025-01-01 |
| 5 | END_DATE | Date | ❌ No | Membership end date | 03-Sep, 2025-04-01 |
| 6 | NAME | String | ✅ Yes | Member full name | YOUSSEF AROUK |
| 7 | PHONE | String | ❌ No | Contact phone | 22698410 |
| 8 | EMAIL | String | ❌ No | Email address | john@gym.com |
| 9 | ADDRESS | String | ❌ No | Physical address | 123 Main St |
| 10 | EMERGENCY | String | ❌ No | Emergency contact | Jane +123456 |

## Important Notes

1. **No Header Row Needed!** - System auto-detects if your first row is data or headers
2. **Column Order Matters** (when no headers): Follow the position order above
3. **File Format**: Use .xlsx or .xls format
4. **Required Fields**: ID, DURATION, AMOUNT, START_DATE, NAME
5. **Optional Fields**: END_DATE (auto-calculated), PHONE, EMAIL, ADDRESS, EMERGENCY_CONTACT
6. **Date Format**: Supports French (04-août) and standard formats (2025-01-01)
7. **Empty Cells**: OK for optional columns like PHONE, END_DATE

## Your Data Format (Works Perfectly!)

```
AD105  1MOIS  100  04-août  03-Sep  YOUSSEF AROUK   22698410
AD106  1MOIS  100  04-août  03-Sep  IDRISS ZAIRI    93510692
AD110  6MOIS  100  04-août          MOUHIB ABASSI   56734858
AD115  1MOIS  120  06-août  06-Sep  AHMED HAJ SASSI
```

## With Headers (Also Works!)

```
ID     DURATION  AMOUNT  START_DATE  END_DATE  NAME              PHONE
AD105  1MOIS     100     04-août     03-Sep    YOUSSEF AROUK     22698410
AD106  1MOIS     100     04-août     03-Sep    IDRISS ZAIRI      93510692
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
