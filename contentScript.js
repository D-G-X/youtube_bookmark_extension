(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideoBookmarks = [];

  chrome.runtime.onMessage.addListener(async (obj, sender, sendResponse) => {
    console.log(obj);
    const { type, value, videoId } = obj;

    console.log("Received NEW message for video:", videoId);
    if (type === "NEW") {
      currentVideo = videoId; // Update the current video ID
      await newVideoLoaded();
      sendResponse({ success: true, videoId: videoId }); // Send a response back
      return true; // Indicate that the response will be sent asynchronously
    }

    return false; // No handling for other message types
  });

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementById("dgx-bookmark-btn");
    // currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("button");
      bookmarkBtn.id = "dgx-bookmark-btn";
      bookmarkBtn.className = "ytp-button";

      const parentContainer = document.querySelector(".ytp-right-controls");
      parentContainer.style.display = "flex"; // Make the container a flex container
      parentContainer.style.alignItems = "center";

      bookmarkBtn.style.width = "48px";
      bookmarkBtn.style.height = "48px";
      bookmarkBtn.style.display = "inline-flex";
      bookmarkBtn.style.justifyContent = "center";
      bookmarkBtn.style.alignItems = "center";
      bookmarkBtn.style.padding = "10px";
      bookmarkBtn.style.border = "none";

      const bookmarkBtnIcon = document.createElement("img");
      bookmarkBtnIcon.src = chrome.runtime.getURL(
        "assets/add_bookmark_btn.svg"
      );
      // Apply styles to the image
      bookmarkBtnIcon.style.maxWidth = "100%";
      bookmarkBtnIcon.style.maxHeight = "100%";
      bookmarkBtnIcon.style.objectFit = "contain";
      //   bookmarkBtnIcon.width = "36";
      //   bookmarkBtnIcon.height = "36";
      bookmarkBtnIcon.title =
        "Click to add bookmark for the current timestamp.";

      bookmarkBtn.append(bookmarkBtnIcon);

      youtubeLeftControls =
        document.getElementsByClassName("ytp-right-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.prepend(bookmarkBtn);
      //   bookmarkBtn.addEventListener("click", addNewBookmark);
    }
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark added at" + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  const getTime = (t) => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString.substr(11, 8);
  };

  newVideoLoaded();
})();
