var srcList = [];

jQuery("img").each(function(index,img){
    src = img.src;
    if(src.match(/l.yimg.com/) || src.match(/geo.yahoo.com/) || src.match(/api.uwh.ect.yahoo.com/))
        return;
    srcList.push(src);
    console.log(src);
});

// Yahoo!奇摩購物中心 
var price = jQuery('div.priceinfo span.price').text().replace(/\D/g, '');;
if(!price)
{
    //Yahoo!奇摩超級商城 
    price = jQuery('div[itemprop="offers"] span.price').text().replace(/\D/g, '');;
    if(!price)
    {
        //Yahoo! 奇摩拍賣
        price = jQuery('li.buy').text().replace(/\D/g, '');;
    }
}
console.log(price);
console.log(document.URL);
console.log(document.title);
$.ajax({
    type : "POST",
    url : "http://pavo-prototype.herokuapp.com/item_lists/1/items?token=abc",
    dataType : "json",
    data :  { url: document.URL, price : price, images : srcList, title: document.title },
    success : function (msg) {},
    error: function(xhr, textStatus, error){
      console.log(xhr.statusText);
      console.log(textStatus);
      console.log(error);
  }
    });
// jQuery.post( "http://pavo-prototype.herokuapp.com/item_lists/1/items?token=abc", 
//     { url: document.URL, price : price, images : srcList, title: document.title });