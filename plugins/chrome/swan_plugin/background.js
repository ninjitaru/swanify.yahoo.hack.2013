chrome.browserAction.onClicked.addListener(function(tab) {
	var username = localStorage.getItem("swan_username");
	if(username == "undefined")
		username = null;
	if(!username)
	{
		chrome.browserAction.setPopup({ popup: "popup.html"});
	}
	else
	{
		chrome.browserAction.setPopup({popup : ""});
	 	chrome.tabs.executeScript(null, { file: "jquery-2.0.3.min.js" }, function() {
	   		chrome.tabs.executeScript(null, { file: "jquery-ui-1.10.3.custom.js" }, function() {
	   			chrome.tabs.executeScript(null, { code: "swan_username='"+username+"';" });
	   			chrome.tabs.executeScript(null, { file: "contentscript.js" });
	   		});
		});
	}
});