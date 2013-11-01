chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, { file: "jquery-2.0.3.min.js" }, function() {
    	chrome.tabs.executeScript(null, { file: "jquery-ui-1.10.3.custom.js" }, function() {
    		chrome.tabs.executeScript(null, { file: "contentscript.js" });
    	});
	});
});
