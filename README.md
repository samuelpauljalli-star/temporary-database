# DevVault - Open Lab & Temporary Database

A secure, high-performance web application featuring Full Stack Development 2 (MERN) and Flutter UI Design laboratory experiments, auto-disappearing temporary files, speech-to-text voice integration, and 1-click code copying.

- **Password to Login:** `20082007`

---

## 🚀 How to Deploy on Render.com

### Option 1: Render Static Site (Recommended & 100% Free)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Static Site**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Click **Create Static Site**. Your site will be live immediately without any 404 or blank screen errors!

### Option 2: Render Web Service (Node.js)
If you created a **Web Service** on Render instead of a Static Site:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start` (or `node server.js`)
- The preconfigured `server.js` will automatically serve the application on the designated port.

---

## 🐙 How to Deploy on GitHub Pages

### Method 1: Automatic GitHub Actions (Preconfigured)
1. Push your repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish your site!

### Method 2: Manual gh-pages Deploy
```bash
npm install
npm run build
npx gh-pages -d dist
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
