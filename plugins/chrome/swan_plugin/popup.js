$(document).ready(function() {

	$( "#target" ).submit(function( event ) {
		var username = $("#target input#username").val();
		username = jQuery.trim(username);
		localStorage.setItem("swan_username", username);
		if(username && username.length > 0)
		{
			chrome.browserAction.setPopup({ popup: ""});
			chrome.tabs.executeScript(null, { file: "jquery-2.0.3.min.js" }, function() {
	  			chrome.tabs.executeScript(null, { file: "jquery-ui-1.10.3.custom.js" }, function() {
	  				chrome.tabs.executeScript(null, { code: "swan_username='"+username+"';" });
	  				chrome.tabs.executeScript(null, { file: "contentscript.js" });
	  			});
			});
		}
      	event.preventDefault();
    });
});

