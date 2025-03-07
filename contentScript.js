(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideoBookmarks = [];
  let currentVideo = null;

  chrome.runtime.onMessage.addListener(async (obj, sender, sendResponse) => {
    const { type, value, videoId } = obj;

    currentVideo = videoId; // Update the current video ID

    if (type === "NEW") {
      await newVideoLoaded();
      sendResponse({ success: true, videoId: videoId }); // Send a response back
      return true; // Indicate that the response will be sent asynchronously
    } else if (type === "PLAY" && value && youtubePlayer) {
      try {
        youtubePlayer.currentTime = value;
        sendResponse({ success: true, videoId: videoId });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else if (type === "DELETE" && value) {
      try {
        currentVideoBookmarks = await fetchBookmarks();
        currentVideoBookmarks = currentVideoBookmarks.filter(
          (b) => b.time != value
        );
        chrome.storage.sync.set({
          [currentVideo]: JSON.stringify(currentVideoBookmarks),
        });
        sendResponse({
          success: true,
          videoId: videoId,
          currentVideoBookmarks: currentVideoBookmarks,
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
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
    const interval = setInterval(() => {
      youtubePlayer = document.querySelector(".video-stream");

      if (youtubePlayer) {
        clearInterval(interval); // Stop checking once the player is available
        const bookmarkBtnExists = document.getElementById("dgx-bookmark-btn");

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
          bookmarkBtnIcon.style.maxWidth = "100%";
          bookmarkBtnIcon.style.maxHeight = "100%";
          bookmarkBtnIcon.style.objectFit = "contain";
          bookmarkBtnIcon.title =
            "Click to add bookmark for the current timestamp.";

          bookmarkBtn.append(bookmarkBtnIcon);

          youtubeLeftControls = document.querySelector(".ytp-right-controls");
          youtubeLeftControls.prepend(bookmarkBtn);
          bookmarkBtn.addEventListener("click", addNewBookmark);
        }
      }
    }, 500); // Check every 500ms until the player is available
  };

  const addNewBookmark = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark added at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set(
      {
        [currentVideo]: JSON.stringify(
          [...currentVideoBookmarks, newBookmark].sort(
            (a, b) => a.time - b.time
          )
        ),
      },
      function () {
        if (chrome.runtime.lastError) {
          console.error("Error saving bookmark:", chrome.runtime.lastError);
        } else {
          console.log("Bookmark saved successfully.");
        }
      }
    );
  };

  const getTime = (t) => {
    var date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substring(11, 19);
  };

  newVideoLoaded();
})();
