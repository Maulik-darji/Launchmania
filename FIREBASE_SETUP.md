# Firebase setup

Waitlist sign-ups are stored in Firestore (`waitlist` collection). `/admin`
shows them, and only **maulik.darji2005@gmail.com**, signed in with Google, can
see it. Everyone else gets a 404.

## 1. Create the project

1. Go to https://console.firebase.google.com → **Add project** (e.g. `launchmania`).
2. **Build → Firestore Database → Create database** (production mode, pick a
   region close to your users, e.g. `asia-south1` for India).
3. **Build → Authentication → Get started → Sign-in method**
   - Enable **Google** only. Leave every other provider disabled.
   - Under **Settings → Authorized domains**, add your live domain once deployed
     (`localhost` is there by default).
4. **Project settings → General → Your apps → Web (`</>`)** → register an app
   and copy the config values.

## 2. Add the config

Paste the web app config into `src/lib/firebase.js`. It's public by design (it
ships in the site's JavaScript), so no environment variables are needed.

## 3. Deploy the security rules

The rules are what actually lock the data down. Anyone may *add* a sign-up,
only the admin may *read*, and nobody may edit or delete through the app.

```bash
firebase use --add            # pick your new project
firebase deploy --only firestore:rules
```

## 4. Host the site (optional)

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` already rewrites every path to `index.html`, so `/admin` and
the 404 page work. On Vercel, `vercel.json` does the same.

## Changing the admin email

Update it in **both** places, then redeploy the rules:

- `src/lib/firebase.js` → `ADMIN_EMAIL`
- `firestore.rules` → `isAdmin()`
