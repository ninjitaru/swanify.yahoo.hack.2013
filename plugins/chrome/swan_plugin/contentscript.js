var username = "ninji";


deleteItemList(username);
getItemListID(username);


function setHeader(xhr) {

  xhr.setRequestHeader('Authorization', '');
}

function printItemListSummary(itemList)
{
    console.log("item list id: " + itemList.id);
    console.log("item list items count: " + itemList.items.length);
    console.log(itemList);
}

function showTopBar() {
    var isNew = true;
    var topbar = $("div#topbar");
    if(topbar.length == 0)
    {
        console.log("create topbar");
        topbar = $("<div id='topbar'></div>");
        topbar.css({
        'position': 'fixed',
        'right': '0px',
        'top': '-160px',
        'z-index': 9999,
        'width': '100%',
        'height': '160px',
        'background-color': 'white'  // Confirm it shows up
        });
        $('body').append(topbar);
        // topbar.append('<input id="mybutton" type="button" value="My button">');
        // $("input#mybutton").click(clearTopBar());
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

function showItemOnBar(item)
{
    var topbar = $("div#topbar");
    // console.log(topbar);
    var string = '<span><a href="#"><img class="swan" width="100px" height="140px" id="'+ item.id +'" src="'+ item.images[0] +'" /></a></span>';
    var imgDom = $(string);
    imgDom.css({
        'position' : 'relative',
        'padding-top' : '10px',
        'padding-left' : '10px',
        'padding-right' : '10px'
        });
    topbar.append(imgDom);
    // $("span a img.swan").click(clearTopBar());
}

function getItemListID(userid) {

    var isNew = showTopBar();
    var value = localStorage.getItem("item_list");
    var itemList = (value && JSON.parse(value));
    if(itemList && itemList.id)
    {
        // printItemListSummary(itemList);
        if(isNew)
        {
            for(var i = 0; i < itemList.items.length; i++)
            {
                showItemOnBar(itemList.items[i]);
            }
            console.log("already have an item list id " + itemList.id + ", sending data");
            sendData(itemList);
        }
        return;
    }
    else
    {
        itemList = new Object();
        itemList.id = userid;
        itemList.items = [];
        localStorage.setItem("item_list", JSON.stringify(itemList));
        sendData(itemList);
    }

    // my toen is id dont use this anymore
  //   $.ajax({
  //   type : "POST",
  //   url : "http://pavo-prototype.herokuapp.com/item_lists?t="+userid,
  //   contentType: "application/json;charset=utf-8",
  //   dataType : "json",
  //   crossDomain: true,
  //   success : function (msg) { 
  //       console.log("create user with item_list_id " + msg.id);
  //       var itemList = new Object();
  //       itemList.id = msg.id;
  //       itemList.items = [];
  //       localStorage.setItem("item_list", JSON.stringify(itemList));
  //       console.log("saved item_list_id");
  //       // console.log(itemList);
  //       sendData(itemList);
  //       // chrome.extension.sendMessage({ item_list_id : msg.id });
  //   },
  //   error: function(xhr, textStatus, error){
  //     // console.log(xhr.statusText);
  //     // console.log(textStatus);
  //     // console.log(error);
  // },
  //   beforeSend: setHeader
  //   });
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
        if(src.match(/(gif|png|jpg|jpeg)$/))
        {
            // console.log("found main image " + src);
            srcList.unshift(src);
        }
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
        url : "http://pavo-prototype.herokuapp.com/item_lists/"+itemList.id+"/items?token=abc",
        contentType: "application/json;charset=utf-8",
        dataType : "json",
        crossDomain: true,
        data :  JSON.stringify({ url: document.URL, price : price, images : srcList, title: document.title }),
        success : function (msg) {
            item.id = msg.id;
            itemList.items.push(item);
            console.log("saving item " + item.id);
            localStorage.setItem("item_list", JSON.stringify(itemList));
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
        url : "http://pavo-prototype.herokuapp.com/item_lists/"+itemListID,
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

function clearTopBar()
{
    var topbar = $("div#topbar");
    if(topbar.length > 0)
    {
        topbar.empty();
    }
}

function autoHideBar()
{
    idleTime = 0;

   //Increment the idle time counter every second.
   var idleInterval = setInterval(timerIncrement, 1000);

   function timerIncrement()
   {
     idleTime++;
     if (idleTime > 3)
     {
       doPreload();
     }
   }

   //Zero the idle timer on mouse movement.
   var topbar = $("div#topbar");
   topbar.mousemove(function(e){
      idleTime = 0;
   });

   function doPreload()
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