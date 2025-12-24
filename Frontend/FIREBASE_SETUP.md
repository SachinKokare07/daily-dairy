# 🔥 Firebase Backend Setup Guide

## Step 1: Install Firebase (Run this in Frontend directory)
```bash
npm install firebase
```

## Step 2: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: **"daily-diary"**
4. Disable Google Analytics (optional) or enable it
5. Click **"Create Project"**

## Step 3: Register Your Web App
1. In Firebase Console, click the **Web icon** (</>)
2. Register app name: **"Daily Diary Web"**
3. **Copy the Firebase configuration** code that appears
4. Open `src/firebase/config.js` and **replace the firebaseConfig object** with your values

Example of what you'll copy:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXX",
  authDomain: "daily-diary-xxxxx.firebaseapp.com",
  projectId: "daily-diary-xxxxx",
  storageBucket: "daily-diary-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

## Step 4: Enable Authentication
1. In Firebase Console, go to **"Authentication"**
2. Click **"Get Started"**
3. Click **"Sign-in method"** tab
4. Enable **"Email/Password"** provider
5. Click **"Save"**

## Step 5: Create Firestore Database
1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create Database"**
3. Choose **"Start in production mode"** (we'll add rules next)
4. Select your preferred location (closest to your users)
5. Click **"Enable"**

## Step 6: Setup Firestore Security Rules
1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Diary entries - users can only read/write their own entries
    match /diaryEntries/{entryId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

## Step 7: Update Your React App

### Update App.jsx to handle authentication:
```javascript
import React, { useState, useEffect } from 'react';
import { onAuthChange } from './firebase/authService';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Header from './Components/Header/Header';
import LandingPage from './Components/LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('landing');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header 
        isAuthenticated={!!user}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        userData={user}
      />
      
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'login' && <Login onLoginSuccess={() => setCurrentPage('dashboard')} />}
      {currentPage === 'dashboard' && user && <Dashboard user={user} />}
    </div>
  );
}

export default App;
```

## Step 8: Test Your Setup
1. Run your app: `npm run dev`
2. Try registering a new user
3. Try logging in
4. Create a diary entry
5. Check Firebase Console to see the data

## 📊 Firebase Collections Structure

### diaryEntries Collection
```javascript
{
  id: "auto-generated-id",
  userId: "user-uid",
  title: "Entry title",
  content: "Entry content",
  mood: "😊",
  date: "2024-01-15",
  isFavorite: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔒 Security Notes
- Never commit your Firebase config with real API keys to GitHub
- Create a `.env` file for production:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
...etc
```

## 🚀 Next Steps
1. Update Login component to use Firebase auth
2. Update Dashboard to load/save entries from Firestore
3. Add loading states and error handling
4. Add profile picture upload using Firebase Storage (optional)

## 📝 Important Commands
```bash
# Install dependencies
npm install firebase

# Run development server
npm run dev

# Build for production
npm run build
```

## ❓ Troubleshooting
- **"Missing or insufficient permissions"**: Check Firestore rules
- **"API key not valid"**: Double-check your Firebase config
- **Network errors**: Check Firebase project is active and billing enabled (free tier is fine)
