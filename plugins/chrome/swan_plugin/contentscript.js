// var username = localStorage.getItem("swan_username");
// username = "ninji";
var username = swan_username;
console.log("context " + username);
var httpURL = "http://pavo-prototype.herokuapp.com/";
var canvasPath = "pavo_canvas/";

appendCSS();
//deleteItemList(username);
getItemListID(username);

// bar functions

function appendCSS()
{
    $('<link rel="stylesheet" href="'+chrome.extension.getURL('collectionstyle.css')+'" type="text/css" />').appendTo('head');
}

function showTopBar() {

    var isNew = true;
    var topbar = $("div.swan_topbar");
    
    if(topbar.length == 0)
    {
        console.log("create topbar");

        topbar = $("<div class='swan_topbar'></div>");
        var topleft = $("<div class='swan_item_list'></div>");
        var topright = $("<div class='swan_plugin_edit_area'></div>");
        topright.css("background-image",'url("'+chrome.extension.getURL('list_tab.png')+'")');
        var toptext = $("<div class='swan_textbar'><a></a></div>");

        topbar.append(topleft);
        topbar.append(topright);
        topbar.append(toptext);
        $('body').append(topbar);

        var editbtn = $("<img src='"+chrome.extension.getURL('edit_btn.png')+"'/>");
        editbtn.css({
            'display' : 'block',
            'position': 'relative',
            'top': '50%',
            'left': '50%',
            'margin-top' : '-34px',
            'margin-left' : '-34px',
        });
        topright.append(editbtn);

        editbtn.hover(function () {
            editbtn.attr('src',chrome.extension.getURL('edit_btn_over.png'));
        }, function () {
            editbtn.attr('src',chrome.extension.getURL('edit_btn.png'));
        });
        editbtn.click(function() {
            chrome.extension.sendMessage({ canvasURL : httpURL + canvasPath + username +".html?t=" + username });
        });
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
    autoHideBar();
  }); 

  return isNew;
}

function clearTopBar()
{
    var topbar = $("div.swan_item_list");
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

   function timerIncrement()
   {
     idleTime++;
     if (idleTime > 6)
     {
        hideTopbarOut();
     }
   }

   //Zero the idle timer on mouse movement.
   var topbar = $("div.swan_topbar");
   topbar.mousemove(function(e){
      idleTime = 0;
   });

   topbar.mouseleave(function(){
        idleInterval = setInterval(timerIncrement, 1000);
   });
   topbar.mouseenter(function(){
        clearInterval(idleInterval);
        idleInterval = null;
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

function showItemOnBar(item, front)
{
    // console.log(item);
    front = true;
    var topbar = $("div.swan_item_list");
    // console.log(topbar);
    var string = '<span><img class="swan draggable" style="border-radius: 4px;border-style:solid;border-width:1px;border-color:#a1dcd8;" width="120px" height="120px" id="'+ item.id +'" src="'+ item.images[0] +'"/></span>';
    var textBlock = $("<div class='swan_innertext'>$ "+item.price+"</div>");

    var imgDom = $(string);
    imgDom.append(textBlock);
    imgDom.css({
        'opacity' : '0',
        'padding-top' : '25px',
        'padding-left' : '6px',
        'padding-right' : '6px',
        'padding-bottom' : '0px',
        'display': 'inline-block',
        });
    imgDom.animate(
  {
    opacity : 1,
    queue  : false,
  }, 
  1000, 
  "linear", 
  function() {
    
  });

    imgDom.draggable({
            revert: "invalid" ,
            zIndex : 999999,
            opacity: 0.7, helper: "clone",
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
    imgDom.hover(function() {
        // $("div.swan_textbar a").attr("href", item.url);
        // $("div.swan_textbar a").text(item.title);
    }, function () {
        // $("div.swan_textbar a").attr("href", "");
        // $("div.swan_textbar a").text("");
    });
    imgDom.click(function(){

        $("img.swan").css("border-width", "1px");
        $("img.swan").css("border-color", "#a1dcd8");
        $("div.swan_innertext").css("left", "1px");
        $("div.swan_innertext").css("top", "-29px");
        $("div.swan_textbar a").attr("href", item.url);
        $("div.swan_textbar a").text(item.title);
        $(this).find("div.swan_innertext").css("left","3px");
        $(this).find("div.swan_innertext").css("top","-30px");
        $(this).find("img").css("border-width", "3px"); 
        $(this).find("img").css("border-color", "#f9a7b5"); 
    });

    if(front)
        topbar.prepend(imgDom);
    else
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
      },
        beforeSend: setHeader
        });

}

function getItemListID(userid) {

    var isNew = showTopBar();

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
        var topbar = $("div.swan_item_list");
        topbar.empty();
        for(var i = 0; i < itemList.items.length; i++)
        {
            showItemOnBar(itemList.items[i],false);
        }
        sendData(itemList);
        // chrome.extension.sendMessage({ item_list_id : msg.id });
    },
    error: function(xhr, textStatus, error){
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
    var foundMainImage = false;
    jQuery("img[class='main-image current']").each(function(index,img){
        var src = img.src;
        foundMainImage = true;
        // if(src.match(/(gif|png|jpg|jpeg)$/))
        // {
            // console.log("found main image " + src);
            srcList.unshift(src);
        // }
    });
    if(!foundMainImage)
    {
        var index = Math.floor(Math.random() * srcList.length) + 1;
        srcList.unshift(srcList[index]);
    }
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
    var lastChar = item.url.substr(item.url.length - 1);
    if(lastChar == "#")
    {
        item.url = item.url.slice(0,-1);
    }
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
            console.log(" adddddd ------- item already exist -------");
            showItemOnBar(item,true);
        },
        error: function(xhr, textStatus, error){
            console.log("------- item already exist -------");
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