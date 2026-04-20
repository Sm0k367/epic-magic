# WINDOWS - Complete Clean Install Instructions

Your local folder has OLD files mixed with new files. Follow these steps EXACTLY:

## ⚠️ IMPORTANT: Delete Everything First

```powershell
# STOP any running npm processes first (Ctrl+C)

# Navigate to your github folder
cd D:\github

# DELETE the entire old pixal-tale folder
Remove-Item -Path "D:\github\pixal-tale" -Recurse -Force

# Confirm it's deleted
dir D:\github
# You should NOT see pixal-tale folder anymore
```

## ✅ Now Clone Fresh

```powershell
cd D:\github

# Clone the CLEAN version
git clone https://github.com/Sm0k367/pixal-tale.git
cd pixal-tale

# Verify you see these files:
dir
# You should see:
#   - index.html
#   - package.json
#   - server.ts (NOT server/index.ts)
#   - src/
#   - vite.config.ts
```

## 🚀 Install and Run

```powershell
# Install all dependencies
npm install

# Check package.json has correct scripts
# Should show "dev": "vite"  (NOT "dev": "cross-env NODE_ENV=development...")

# Run
npm run dev

# You should see:
#   VITE v6.4.2  ready in XXX ms
#   ➜  Local:   http://localhost:5173/
```

## 📂 What You'll See

After cloning, your folder structure should be:
```
D:\github\pixal-tale\
├── .git
├── .env
├── .gitignore
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── server.ts              ← NEW simple Express server
├── src/                   ← React components
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

**NOT:**
```
D:\github\pixal-tale\pixal-tale\  ← WRONG! Double nested folder
D:\github\pixal-tale\server\      ← WRONG! Should be server.ts file
```

## 🎯 If You See Errors

### Error: "listen ENOTSUP" or "server/index.ts not found"
You still have old files. **Start over from step 1** - delete the entire folder and clone fresh.

### Error: "Port 5173 already in use"
That's fine! Vite will use 5174 instead. Just open http://localhost:5174

### Error: "npm install" fails
Try this:
```powershell
$env:npm_config_build_from_source=true
npm install
```

## ✨ That's It!

Once you see `VITE ready in XXX ms`, you're good to go.

Open http://localhost:5173 in your browser and test the app.

---

**DO NOT** proceed to development until you can successfully run `npm run dev` without errors.
