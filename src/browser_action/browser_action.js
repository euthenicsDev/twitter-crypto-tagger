function onButtonClick() {
  chrome.runtime.sendMessage({ type: "buttonClick" }, function (response) {
    console.log(response);
  });
}

function addTagTest() {
  const name = document.querySelector("#newName").value;
  const tag = document.querySelector("#tagsForName").value;
  chrome.runtime.sendMessage(
    { type: "addTagToName", name: name, tag: tag },
    function (response) {
      chrome.extension.getBackgroundPage().console.log(response);
      // alert(response.type + " " + response.name + " " + response.tags.size);
    }
  );
}

function clearStorage() {
  chrome.runtime.sendMessage({ type: "clearStorage" }, function (response) {
    chrome.extension.getBackgroundPage().console.log(response);
  });
}

document.querySelector("#addTagButton").addEventListener("click", addTagTest);
document
  .querySelector("#clearStorageButton")
  .addEventListener("click", clearStorage);

// () => {
// read the colour that the user has selected
// get all the google tabs and send a message to their tabs
// chrome.tabs.query({ url: "https://*.google.com/*" }, (tabs) => {
//   console.log("to tab", tabs);
//   tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, { colour }));
// });
// };
