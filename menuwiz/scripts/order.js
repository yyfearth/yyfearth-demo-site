// Menu Wiz - Wilson Young (yyfearth@gmail.com) - Dynamic6 @ sjsu.yyfearth.com
(function(){var b,a;a=location.search.match(/1\d\d\d/);null==a||1!==a.length?alert("invalid order id!"):(a=a[0],b=sessionStorage["order-html-"+a],null==b?alert("invalid order content!"):($("#order_id").text(a),$("#order_content").append($(b).first().nextAll())))}).call(this);
