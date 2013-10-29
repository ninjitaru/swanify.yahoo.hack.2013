chrome.browserAction.onClicked.addListener(function(tab) {
  console.log(tab.url);
  console.log(tab.title);
  chrome.tabs.executeScript(null, { file: "jquery-2.0.3.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "contentscript.js" });
});

// if(images)
// {
//     var srcList = [];
//     // var regex = /tw.bid.yimg.com/;
//     for(var i = 0; i < images.length; i++) 
//     {
//         if(images[i].src.match(/l.yimg.com/))
//         	continue;
//         if(images[i].src.match(/geo.yahoo.com/))
//         	continue;
//         if(images[i].src.match(/api.uwh.ect.yahoo.com/))
//         	continue;
//         srcList.push(images[i].src);
//     }

//     var pagetitle = document.title;
//     var payload = { count : images.length , items : srcList , title : pagetitle};
//     chrome.extension.sendRequest(payload, function(response) {});
// }'
   
});
