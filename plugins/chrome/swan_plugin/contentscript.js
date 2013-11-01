
var username = "ninji";
var httpURL = "http://pavo-prototype.herokuapp.com/";
var canvasPath = "pavo_canvas/";

//deleteItemList(username);
getItemListID(username);

// bar functions

function showTopBar() {
    var isNew = true;
    var topbar = $("div#topbar");
    var topleft;
    if(topbar.length == 0)
    {
        console.log("create topbar");
        topbar = $("<div id='topbar'></div>");
        topbar.css({
        'position': 'fixed',
        'left': '0px',
        'top': '-160px',
        'z-index': 9999,
        // 'max-width':'100%',
        // 'max-height':'160px',
        'width': '100%',
        'height': '160px',
        'background-color': 'white'
        });
        $('body').append(topbar);
        topleft = $("<div id='topleftbar'></div>");
        topleft.css({
            'left': '0px',
            'top': '0px',
            // 'z-index': 9999,
            'float':'left',
            'padding-top' : '10px',
            'overflow':'auto',
            'white-space': 'nowrap',
            'width': '80%',
            'height': '150px',
            'background-color': 'blue'  // Confirm it shows up
        });
        topbar.append(topleft);
        var topright = $("<div id='toprightbar'></div>");
        topright.css({
            'top': '0px',
            'float':'left',
            'padding-top' : '10px',
            'width': '20%',
            'height': '150px',
            'background-color': 'yellow'
        });
        topbar.append(topright);
        topright.click(function() {
            chrome.extension.sendMessage({ canvasURL : httpURL + canvasPath + username +".html" });
        });
        // topright.click(openCanvasPage());
    }
    else
    {
        console.log("use existing topbar");
        topbar = topbar.first();
        isNew = false;
    }

  // animate the toolbar appreance
  topbar.animate(
  {
    top : "0px"
  }, 
  500, 
  "linear", 
  function() {
    //autoHideBar();
  }); 

  return isNew;
}

function clearTopBar()
{
    var topbar = $("div#topleftbar");
    if(topbar.length > 0)
    {
        topbar.empty();
    }
}

var idleInterval;

function autoHideBar()
{
    idleTime = 0;

   //Increment the idle time counter every second.
   idleInterval = setInterval(timerIncrement, 1000);

   function timerIncrement()
   {
     idleTime++;
     if (idleTime > 12)
     {
        hideTopbarOut();
     }
   }

   //Zero the idle timer on mouse movement.
   var topbar = $("div#topbar");
   topbar.mousemove(function(e){
      idleTime = 0;
   });

   function hideTopbarOut()
   {
        topbar.animate(
      {
        top : "-160px"
      }, 
      500, 
      "linear", 
      function() {
        topbar.remove();
        console.log("leaving delete topbar");
        clearInterval(idleInterval);
      }); 
         //Preload images, etc.
       }
}

// helpers

function setHeader(xhr) {

  xhr.setRequestHeader('Authorization', '');
}

function printItemListSummary(itemList)
{
    console.log("item list id: " + itemList.id);
    console.log("item list items count: " + itemList.items.length);
    console.log(itemList);
}

// item functions

var finalY;

function showItemOnBar(item)
{
    var topbar = $("div#topleftbar");
    // console.log(topbar);
    var string = '<span><a href="#"><img class="swan draggable" width="100px" height="140px" id="'+ item.id +'" src="'+ item.images[0] +'" /></a></span>';
    var imgDom = $(string);
    imgDom.css({
        // 'position' : 'relative',
        'padding-top' : '0px',
        'padding-left' : '10px',
        'padding-right' : '10px',
        'display': 'inline-block'
        });
    imgDom.draggable({
            revert: "invalid" ,
            zIndex : 999999,
            opacity: 0.7, helper: "clone",
            // helper: function(){
            //     $copy = $(this).clone();
            //     return $copy;},
            appendTo: 'body',
            scroll: false,
            drag: function(event,ui) {
                finalY = ui.helper.position().top;
            },
            stop: function(event,ui) {
                if(finalY > 160)
                {
                    deleteItem(imgDom);
                }
            }
        });
    topbar.append(imgDom);
}

function openCanvasPage()
{
    console.log("hihihi");
    chrome.extension.sendMessage({ userid : username });
    console.log("hihihi 22");
}

function deleteItem(itemDom)
{
    // itemDom.find("img").attr("id");
    var itemID = itemDom.find("img").attr("id");

    $.ajax({
        type : "DELETE",
        url : httpURL + "item_lists/"+username+"/items/"+itemID,
        contentType: "application/json;charset=utf-8",
        dataType : "json",
        crossDomain: true,
        success : function (msg) {
            console.log("success");
            itemDom.remove();
        },
        error: function(xhr, textStatus, error){
          // showItemOnBar(item);
          // console.log(xhr.statusText);
          // console.log(textStatus);
          // console.log(error);
      },
        beforeSend: setHeader
        });

}

function getItemListID(userid) {

    var isNew = showTopBar();
    // var value = localStorage.getItem("item_list");
    // var itemList = (value && JSON.parse(value));
    // if(itemList && itemList.id)
    // {
    //     // printItemListSummary(itemList);
    //     if(isNew)
    //     {
    //         // for(var i = 0; i < itemList.items.length; i++)
    //         // {
    //         //     showItemOnBar(itemList.items[i]);
    //         // }
    //         console.log("already have an item list id " + itemList.id + ", sending data");
    //         sendData(itemList);
    //     }
    // }
    // else
    // {
    //     itemList = new Object();
    //     itemList.id = userid;
    //     itemList.items = [];
    //     localStorage.setItem("item_list", JSON.stringify(itemList));
    //     sendData(itemList);
    // }

    // my toen is id dont use this anymore
    $.ajax({
    type : "GET",
    url : httpURL + "item_lists/"+userid,
    contentType: "application/json;charset=utf-8",
    dataType : "json",
    crossDomain: true,
    success : function (msg) { 
        console.log("create user with item_list_id ");
        // console.log(msg);
        var itemList = msg;
        var topbar = $("div#topleftbar");
        topbar.empty();
        for(var i = 0; i < itemList.items.length; i++)
        {
            showItemOnBar(itemList.items[i]);
        }
        // itemList.id = msg.id;
        // itemList.items = [];
        // localStorage.setItem("item_list", JSON.stringify(itemList));
        // console.log("saved item_list_id");
        // console.log(itemList);
        sendData(itemList);
        // chrome.extension.sendMessage({ item_list_id : msg.id });
    },
    error: function(xhr, textStatus, error){
      // console.log(xhr.statusText);
      // console.log(textStatus);
      // console.log(error);
  },
    beforeSend: setHeader
    });
}

function sendData(itemList)
{
    if(!itemList || !itemList.id)
        return;
    console.log("sending item_list " + itemList.id + " data");
    var srcList = [];

    jQuery("img").each(function(index,img){
        var src = img.src;
        if(src.match(/l.yimg.com/) || src.match(/geo.yahoo.com/) || src.match(/api.uwh.ect.yahoo.com/))
            return;
        if(src.length == 0)
            return;
        if(src.match(/(gif|png|jpg|jpeg)$/))
        {
            srcList.push(src);
        }
    });

    // find main image
    jQuery("img[class='main-image current']").each(function(index,img){
        var src = img.src;
        // if(src.match(/(gif|png|jpg|jpeg)$/))
        // {
            // console.log("found main image " + src);
            srcList.unshift(src);
        // }
    });
    console.log("main image " + srcList[0]);

    // Yahoo!奇摩購物中心 
    var price = jQuery('div.priceinfo span.price').first().text().replace(/[^\d]/g, '');
    if(!price)
    {
        //Yahoo!奇摩超級商城 
        price = jQuery('div[itemprop="offers"] span.price').first().text().replace(/[^\d]/g, '');
        if(!price)
        {
            //Yahoo! 奇摩拍賣
            price = jQuery('li.buy').first().text().replace(/[^\d]/g, '');
        }
    }

    var item = new Object();
    item.url = document.URL;
    item.price = price;
    item.images = srcList;
    item.title = document.title;
    var output = { url: document.URL, price : parseInt(price), images : srcList, title: document.title };

    $.ajax({
        type : "POST",
        url : httpURL + "item_lists/"+itemList.owner+"/items",
        contentType: "application/json;charset=utf-8",
        dataType : "json",
        crossDomain: true,
        data :  JSON.stringify({ url: document.URL, price : price, images : srcList, title: document.title }),
        success : function (msg) {
            item.id = msg.id;
            itemList.items.push(item);
            // console.log("saving item " + item.id);
            // localStorage.setItem("item_list", JSON.stringify(itemList));
            showItemOnBar(item);
        },
        error: function(xhr, textStatus, error){
          // showItemOnBar(item);
          // console.log(xhr.statusText);
          // console.log(textStatus);
          // console.log(error);
      },
        beforeSend: setHeader
        });
}

function deleteItemList(itemListID)
{
    localStorage.clear();
    $.ajax({
        type : "DELETE",
        url : httpURL + "item_lists/"+itemListID,
        contentType: "application/json;charset=utf-8",
        dataType : "json",
        crossDomain: true,
        success : function (msg) {
            clearTopBar();
        },
        error: function(xhr, textStatus, error){
          // showItemOnBar(item);
          // console.log(xhr.statusText);
          // console.log(textStatus);
          // console.log(error);
      },
        beforeSend: setHeader
        });
}