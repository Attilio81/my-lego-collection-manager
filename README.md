# 🧱 My LEGO Collection Manager

A modern, beautiful web application to manage and track your LEGO collection with automatic data fetching from Rebrickable API.

![LEGO Collection Manager](https://img.shields.io/badge/LEGO-Collection%20Manager-yellow?style=for-the-badge&logo=lego)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)

## 🌐 Live Demo

**Try it now:** [https://attilio81.github.io/my-lego-collection-manager/](https://attilio81.github.io/my-lego-collection-manager/)

No installation required - just open the link and start managing your LEGO collection!

## ✨ Features

### 📦 Collection Management
- **Add sets manually** - Simply enter the set number and fetch details automatically
- **Import from JSON** - Bulk import your collection from a JSON file
- **Delete sets** - Remove individual sets or clear entire database
- **Search & Filter** - Search by name/code and filter by theme (Marvel, City, Disney, etc.)

### 🔄 Rebrickable Integration
- **Automatic sync** - Fetch official LEGO set details from Rebrickable API
- **Theme hierarchy** - Automatically resolves parent themes (e.g., "Spidey" → "Marvel")
- **Rich metadata** - Set names, images, product URLs, and themes
- **Custom API key** - Use your own Rebrickable API key in the user profile

### 💾 Local Storage
- **IndexedDB** - All data stored locally in your browser
- **Offline ready** - Works without internet after initial data fetch
- **Privacy first** - No server, no tracking, all data stays on your device

### 🎨 Modern UI
- **Dark theme** - Easy on the eyes with yellow/gold accents
- **Responsive design** - Works on desktop, tablet, and mobile
- **Smooth animations** - Polished user experience
- **Card layout** - Beautiful display of your collection

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Attilio81/my-lego-collection-manager.git
   cd my-lego-collection-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3001
   ```

## 📖 Usage

### Adding Sets

**Method 1: Manual Entry**
1. Click the **+** button (bottom right)
2. Enter the set number (e.g., "76287", "60411")
3. Click "Add Set"
4. Details are fetched automatically from Rebrickable

**Method 2: JSON Import**
1. Click the **User Profile** icon (👤) in the header
2. In the "Data Management" section, click **Import JSON**
3. Prepare a JSON file with this format:
   ```json
   {
     "lego_sets": [
       {"set_number": "76287"},
       {"set_number": "60411"},
       {"set_number": "43260"}
     ]
   }
   ```
4. Select your JSON file
5. Click **Sync** (🔄) to fetch all details from Rebrickable

### Managing Your Collection

- **Search**: Use the search bar to find sets by name or code
- **Filter by theme**: Click theme buttons to filter (All, Marvel, City, Disney, etc.)
- **Sync data**: Click the sync button (🔄) to update all sets with latest info
- **Delete sets**: Click trash icon on any card to remove it

### User Profile & Settings

Click the **User Profile** icon (👤) in the header to access:

- **API Key Management**: View/edit your Rebrickable API key (with masking for security)
- **Data Management**: 
  - **Import JSON**: Bulk import sets from a JSON file
  - **Clear Database**: Remove all sets with double confirmation
- **App Info**: View version and details

**Mobile-friendly**: The profile modal is optimized for mobile devices and can be closed with the **X** button or **ESC** key.

**Get a free Rebrickable API key**: [rebrickable.com/api](https://rebrickable.com/api/)

## 🛠️ Tech Stack

- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **IndexedDB** - Local storage (via `idb` package)
- **Rebrickable API** - LEGO data source

## 📁 Project Structure

```
my-lego-collection-manager/
├── components/
│   ├── AddSetForm.tsx          # Modal to add single set
│   ├── ClearDatabaseButton.tsx # Button to clear all data
│   ├── Icons.tsx                # SVG icon components
│   ├── ImportJsonButton.tsx     # JSON import button
│   ├── LegoSetCard.tsx          # Display card for each set
│   └── UserProfile.tsx          # User profile modal
├── data/
│   └── initialData.ts           # Initial data (empty by default)
├── utils/
│   ├── db.ts                    # IndexedDB operations
│   ├── importJson.ts            # JSON import logic
│   └── settings.ts              # User settings storage
├── App.tsx                      # Main application component
├── types.ts                     # TypeScript type definitions
├── index.tsx                    # App entry point
└── vite.config.ts              # Vite configuration
```

## 🔧 Configuration

### Port Configuration
Default port is `3001`. To change it, edit `vite.config.ts`:
```typescript
server: {
  port: 3001,
  host: '0.0.0.0',
}
```

### API Configuration
Default Rebrickable API key is included. For heavy usage, get your own free key and add it in the User Profile.

## 🏗️ Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

## 🚀 Deploy to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. **Enable GitHub Pages** in your repository settings:
   - Go to `Settings` → `Pages`
   - Under "Source", select `GitHub Actions`

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Wait for deployment**:
   - GitHub Actions will automatically build and deploy
   - Your site will be live at: `https://YOUR_USERNAME.github.io/my-lego-collection-manager/`

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the app
npm run build

# Deploy the dist folder to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

## 📝 Example JSON Import Format

```json
{
  "lego_sets": [
    {
      "set_number": "43260",
      "theme": "Disney",
      "name": "Moana's Island Home",
      "booklets": ["1", "2"]
    },
    {
      "set_number": "76287"
    }
  ]
}
```

**Note:** Only `set_number` is required. Other fields are optional and will be fetched from Rebrickable.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Rebrickable** for providing the comprehensive LEGO database API
- **LEGO®** for creating amazing building sets (LEGO® is a trademark of the LEGO Group)
- Built with ❤️ for LEGO enthusiasts

## 📧 Contact

Attilio - [@Attilio81](https://github.com/Attilio81)

Project Link: [https://github.com/Attilio81/my-lego-collection-manager](https://github.com/Attilio81/my-lego-collection-manager)

---

**Note**: This is an unofficial fan project and is not affiliated with or endorsed by the LEGO Group.
