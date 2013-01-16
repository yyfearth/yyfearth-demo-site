// Menu Wiz - Wilson Young (yyfearth@gmail.com) - Dynamic6 @ sjsu.yyfearth.com
(function(){var a,b,c,d;b=location.search.match(/1\d\d\d/);null==b||1!==b.length?alert("invalid order id!"):(b=b[0],a=sessionStorage["order-html-"+b],null==a?alert("invalid order content!"):(d=document.getElementById("order_id"),c=document.getElementById("order_content"),d.innerText=d.textContent=b,c.innerHTML=a))})()
