# EcoStep Mobile App

React Native mobile application for iOS and Android.

## 🚀 Features

- **Cross-Platform**: Single codebase for iOS and Android
- **Native Performance**: Built with React Native
- **Real-time Sync**: Syncs with backend API
- **Beautiful UI**: Modern, eco-themed design
- **Offline Support**: AsyncStorage for local data

## 📋 Prerequisites

- Node.js >= 18
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Install iOS dependencies (macOS only):
```bash
cd ios && pod install && cd ..
```

3. Configure API endpoint:
Edit `src/services/api.js` and update the `API_BASE_URL` to your backend URL.

## 🏃 Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Development Mode
```bash
npm start
```

## 📱 Screens

- **Splash**: Loading screen with branding
- **Login/Register**: User authentication
- **Dashboard**: Overview of eco-impact
- **Challenges**: Browse and take challenges
- **Challenge Detail**: View challenge details and take action
- **Leaderboard**: Global and weekly rankings
- **Marketplace**: Shop sustainable products
- **Profile**: User settings and lifestyle preferences

## 🏗️ Project Structure

```
mobile/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/
│   ├── screens/      # App screens
│   ├── context/      # React Context (Auth)
│   ├── services/     # API services
│   └── components/   # Reusable components
├── App.js            # Main app component
└── package.json
```

## 🎨 Design System

### Colors
- Primary Green: `#22c55e`
- Background: `#f0fdf4`
- Text: `#333333`
- Secondary: `#666666`

### Typography
- Headers: Bold, 24-32px
- Body: Regular, 14-16px
- Small: 12px

## 📦 Build for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

The APK will be available at:
`android/app/build/outputs/apk/release/app-release.apk`

### iOS
1. Open `ios/EcoStepMobile.xcworkspace` in Xcode
2. Select "Product" > "Archive"
3. Follow the distribution wizard

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Environment Variables

Create a `.env` file:
```
API_URL=http://your-api-url.com/api/v1
```

## 🔒 Security

- JWT tokens stored in AsyncStorage
- Sensitive data encrypted
- API requests authenticated
- No hardcoded credentials

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
