// Menu Wiz - Wilson Young (yyfearth@gmail.com) - Dynamic6 @ sjsu.yyfearth.com
(function(){var c,a,d,b;a=location.search.match(/1\d\d\d/);null==a||1!==a.length?alert("invalid order id!"):(a=a[0],(c=sessionStorage["order-html-"+a])?(b=document.getElementById("order_id"),d=document.getElementById("order_content"),b.innerText=b.textContent=a,d.innerHTML=c):alert("invalid order content!"))})();
