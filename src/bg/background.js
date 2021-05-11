// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

const storedNames = new Set();
var storedTags = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message === "undefined" || !message.type) {
    sendResponse("Unable to parse message");
    return;
  }

  switch (message.type) {
    case "clearStorage":
      clearStorage(sendResponse);
      break;
    case "clearStorageForName":
      clearStorageForName(name, sendResponses);
      break;
    case "syncStorage":
      syncStorage(sendResponse);
      break;
    case "addTagToName":
      addTagToNameInStorage(message.name, message.tag, sendResponse);
      break;
    case "removeTagFromName":
      removeTagFromNameInStorage(message.name, message.tag, sendResponse);
      break;
    case "removeName":
      break;
    case "buttonClick":
      alert("clicked the button!");
      break;
    default:
      sendResponse("Unable to parse message type");
      break;
  }

  return true;
});

function syncStorage(sendResponse) {
  chrome.storage.sync.get("storedTwitterNames", function (result) {
    storedNames = JSON.parse(result);
    storedNames.forEach(function (name) {
      chrome.storage.sync.get(name, function (result) {
        storedTags[name] = result;
        // TODO: Wait for all of these and send a response
        // Or send a message with each of these
      });
    });
  });
}

function addTagToNameInStorage(name, tag, sendResponse) {
  if (!storedNames.has(name)) {
    storedNames.add(name);
    storedTags[name] = new Set();
    chrome.storage.sync.set(
      { storedTwitterNames: JSON.stringify(storedNames) },
      function () {
        // TODO: Send a message back?
      }
    );
  }

  if (!storedTags[name].has(tag)) {
    storedTags[name].add(tag);
    var objToPush = {};
    objToPush[name] = storedTags[name];
    chrome.storage.sync.set(objToPush, function () {
      sendResponse({
        type: "addedTagToName",
        name: name,
        tags: Array.from(storedTags[name]),
      });
    });
  } else {
    sendResponse({ type: "tagAlreadyAddedToName", name: name, tag: tag });
  }
}

function removeTagFromNameInStorage(name, tag, sendResponse) {
  alert("removed tag " + tag + "from name " + name);
  sendResponse("Removed tag from name");
}

function clearStorage(sendResponse) {
  chrome.storage.sync.clear(function () {
    storedNames.clear();
    storedTags = {};
    sendResponse("Storage is cleared!");
  });
}

function clearStorageForName(name, sendResponse) {
  chrome.storage.sync.remove(name, function () {
    storedNames.delete(name);
    delete storedTags[name];
    sendResponse("Cleared keys from storage: " + name);
  });
}
