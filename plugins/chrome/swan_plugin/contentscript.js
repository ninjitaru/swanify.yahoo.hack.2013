images = document.getElementsByTagName('img');
if(images)
{
    var srcList = [];

    // console.log(jQuery("img").size());
    // var regex = /tw.bid.yimg.com/;
    for(var i = 0; i < images.length; i++) 
    {
        if(images[i].src.match(/l.yimg.com/))
        	continue;
        if(images[i].src.match(/geo.yahoo.com/))
        	continue;
        if(images[i].src.match(/api.uwh.ect.yahoo.com/))
        	continue;
        srcList.push(images[i].src);
    }

    alert(document.URL);
    alert(document.title);
    alert(images.length);
    
    jQuery.post( "http://pavo-prototype.herokuapp.com/item_lists/1/items", 
        { url: document.URL, price : "100", images : srcList, title: document.title });
}