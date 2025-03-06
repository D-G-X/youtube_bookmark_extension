chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const videoId = urlParameters.get("v");

    // Inject the content script
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["contentScript.js"],
      },
      () => {
        // Send the message after the content script is injected
        chrome.tabs.sendMessage(
          tabId,
          {
            type: "NEW",
            value: null,
            videoId: videoId,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error sending message:",
                chrome.runtime.lastError.message
              );
            } else {
              console.log("Received response:", response);
            }
          }
        );
      }
    );
  }
});
