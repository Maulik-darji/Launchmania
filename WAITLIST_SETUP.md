# Waitlist setup (free, ~5 minutes)

Sign-ups are sent to whatever URL is in `VITE_WAITLIST_ENDPOINT`. The easiest
free option is a Google Sheet + Apps Script.

## 1. Create the sheet

1. Create a new Google Sheet named **Launchmania Waitlist**.
2. In row 1 add these headers (exact spelling):

   `joinedAt | email | name | productUrl | productType | stage | audience | willingToPay | source | referrer`

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Replace the code with:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  const p = e.parameter
  sheet.appendRow(headers.map((h) => p[h] || ''))
  return ContentService.createTextOutput('ok')
}
```

3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the Web app URL (ends in `/exec`).

## 3. Connect the site

```bash
cp .env.example .env
```

Paste the URL into `.env`:

```
VITE_WAITLIST_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
```

Restart `npm run dev`. On your host (Vercel / Netlify), add the same variable in
the project's environment settings.

## Reading the demand signal

- `source = hero` → quick email-only sign-up.
- `source = waitlist-form` → full details (stronger intent).
- `source = details-update` → someone who signed up in the hero then came back
  to add details.
- `willingToPay` tells you whether a paid "done-for-you" tier is worth building.

Formspree, Sheet Monkey or any form backend that accepts a form-encoded POST
also works — just put its URL in `VITE_WAITLIST_ENDPOINT`.
