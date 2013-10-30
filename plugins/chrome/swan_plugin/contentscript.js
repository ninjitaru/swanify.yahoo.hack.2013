
function setHeader(xhr) {

  xhr.setRequestHeader('Authorization', '');
}

function printItemListSummary(itemList)
{
    console.log("item list id: " + itemList.id);
    console.log("item list items count: " + itemList.items.length);
    console.log(itemList);
}

function getItemListID(userid) {

    var value = localStorage.getItem("item_list");
    var itemList = (value && JSON.parse(value));
    if(itemList && itemList.id)
    {
        printItemListSummary(itemList);
        console.log("already have an item list id " + itemList.id + ", sending data");
        sendData(itemList);
        return;
    }

    $.ajax({
    type : "POST",
    url : "http://pavo-prototype.herokuapp.com/item_lists?t="+userid,
    contentType: "application/json;charset=utf-8",
    dataType : "json",
    crossDomain: true,
    success : function (msg) { 
        console.log("create user with item_list_id " + msg.id);
        var itemList = new Object();
        itemList.id = msg.id;
        itemList.items = [];
        localStorage.setItem("item_list", JSON.stringify(itemList));
        console.log("saved item_list_id");
        console.log(itemList);
        sendData(itemList);
        // chrome.extension.sendMessage({ item_list_id : msg.id });
    },
    error: function(xhr, textStatus, error){
      console.log(xhr.statusText);
      console.log(textStatus);
      console.log(error);
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
        if(src.match(/(gif|png|jpg|jpeg)$/))
        {
            console.log("found main image " + src);
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
        },
        error: function(xhr, textStatus, error){
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
      },
        beforeSend: setHeader
        });
}

getItemListID("ninji");