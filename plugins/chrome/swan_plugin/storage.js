chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
    	console.log(request.a);
        // if(request.type == "popup_var"){
        //      The type of message has been identified as the variable for our popup, let's save it to localStorage 
        //     localStorage["popup_var"] = request.my_variable;
        // }
    }
);