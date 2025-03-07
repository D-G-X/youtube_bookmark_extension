async function getActiveTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const renderNewBookmark = (bookmarkContainer, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controls = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  controls.className = "bookmark-controls";

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);
  controls.setAttribute("timestamp", bookmark.time);

  setBookmarkAttributes("play", onPlay, controls);
  setBookmarkAttributes("delete", onDelete, controls);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controls);
  bookmarkContainer.appendChild(newBookmarkElement);
};

const renderBookmarks = (currentBookmarks = []) => {
  const bookmarkElement = document.getElementById("bookmarks");
  bookmarkElement.innerHTML = "";
  if (currentBookmarks.length != 0) {
    currentBookmarks.forEach((bookmark) => {
      renderNewBookmark(bookmarkElement, bookmark);
    });
  } else {
    bookmarkElement.innerHTML =
      "There are no bookmarks available for the current video.";
  }
};

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTab();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (e) => {
  const activeTab = await getActiveTab();
  const bookmarkTime = e.target.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
  const response = await chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
    videoId: currentVideo,
  });

  console.log("response", response.newBookmarks);
  renderBookmarks(response.newBookmarks);
};

const setBookmarkAttributes = (
  attributeType,
  eventListener,
  controlParentElement
) => {
  const controlElement = document.createElement("img");
  controlElement.style.padding = "5px 5px";
  controlElement.style.width = "18px";
  controlElement.style.height = "20px";
  controlElement.src = "assets/" + attributeType + "_bookmark_btn.svg";
  controlElement.title = attributeType;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTab();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      renderBookmarks(currentVideoBookmarks);
    });
  } else {
    document.getElementById("container").innerHTML = `
        <div>
            This extension only works for when you are watching a video on YouTube.
        </div>    
    `;
  }
});
