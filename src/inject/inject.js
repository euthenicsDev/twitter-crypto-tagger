const DEBUG = false;

const namesOnPage = {};

chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading

      refreshData();
      setInterval(refreshData, 3000);

      // ----------------------------------------------------------
    }
  }, 10);
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.colour) {
    document.body.style.backgroundColor = request.colour;
  }
});

function refreshData() {
  fetchNamesOnPage();
}

// Brittle
function fetchNamesOnPage() {
  // =============== DEBUGGING MEMORY LEAKS ===============
  if (DEBUG) {
    console.log("================");
    for (var nameOnPage in namesOnPage) {
      console.log(nameOnPage, namesOnPage[nameOnPage]);
    }
    console.log("================");
  }

  // .r-13hce6t - margin-left class for @username in UI
  // .r-1wbh5a2 - flex-shrink: 1 class in UI
  // div.r-13hce6t.r-1wbh5a2
  $("div.r-13hce6t.r-1wbh5a2")
    .map(function () {
      let key = $(this).children().first().children().first().html();
      if (!(key in namesOnPage)) {
        namesOnPage[key] = new Set();
      }
      namesOnPage[key].add(this);
      return;
    })
    .get();
}
