# 📺 YouTube Bookmark Extension

A lightweight Chrome extension that lets you **bookmark important moments in YouTube videos** and quickly revisit them anytime.

---

## 🚀 Features

- ⏱️ **Timestamp Bookmarking**  
  Save specific moments in any YouTube video with a single click.

- ⚡ **Quick Navigation**  
  Instantly jump back to saved timestamps.

- 🧠 **Smart Organization**  
  Store and manage bookmarks for each video.

- 🧩 **Seamless Integration**  
  Works directly inside the YouTube player interface.

- 💾 **Persistent Storage**  
  Bookmarks are stored locally (or synced depending on implementation).

---

## 🛠️ Tech Stack

- JavaScript (Vanilla JS)
- Chrome Extensions API
- HTML & CSS
- Chrome Storage API

---

## 📂 Project Structure

```
youtube_bookmark_extension/
│── assets/             # Icons and static assets
│── background.js       # Background service worker
│── contentScript.js    # Injected script for YouTube interaction
│── popup.html          # Extension popup UI
│── popup.css           # Styling for popup
│── popup.js            # Popup logic
│── utils.js            # Helper functions
│── manifest.json       # Extension configuration
```

---

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/D-G-X/youtube_bookmark_extension.git
```

2. Open Chrome and go to:
```
chrome://extensions/
```

3. Enable **Developer Mode** (top right)

4. Click **Load unpacked**

5. Select the project folder

---

## 🧑‍💻 Usage

1. Open any YouTube video  
2. Click the **bookmark button** (added by the extension)  
3. Save the current timestamp  
4. Open the extension popup to:
   - View bookmarks
   - Navigate to saved timestamps
   - Delete bookmarks

---

## 💡 Use Cases

- 📚 Studying lectures (jump to key concepts)
- 🎥 Saving highlights from long videos
- 🧑‍💻 Referencing coding tutorials
- 🎵 Bookmarking favorite moments in music/videos  

---

## 🔮 Future Improvements

- ✏️ Add notes/descriptions to bookmarks  
- 📁 Folder-based organization  
- 🔍 Search bookmarks  
- ☁️ Cloud sync across devices  
- 📤 Export/import bookmarks  
