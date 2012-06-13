// Menu Wiz - Wilson Young (yyfearth@gmail.com) - Dynamic6 @ sjsu.yyfearth.com (with Modernizr 2.0.6)
(function(){(function(a,b,c){function e(a,b){for(var d in a)if(g[a[d]]!==c)return"pfx"==b?a[d]:!0;return!1}var a={},f=b.documentElement;b.head||b.getElementsByTagName("head");var d=b.createElement("modernizr"),g=d.style,i=" -webkit- -moz- -o- -ms- -khtml-".split(" "),o=["Webkit","Moz","O","ms","Khtml"],d={},h=[],j,l={}.hasOwnProperty,m;typeof l!==c&&typeof l.call!==c?m=function(a,b){return l.call(a,b)}:m=function(a,b){return b in a&&typeof a.constructor.prototype[b]===c};d.rgba=function(){g.cssText=
"background-color:rgba(150,255,150,.5)";return!!~(""+g.backgroundColor).indexOf("rgba")};d.cssgradients=function(){var a=("background-image:"+i.join("gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:")+i.join("linear-gradient(left top,#9f9, white);background-image:")).slice(0,-17);g.cssText=a;return!!~(""+g.backgroundImage).indexOf("gradient")};for(var k in d)m(d,k)&&(j=k.toLowerCase(),a[j]=d[k](),h.push((a[j]?"":"no-")+j));g.cssText="";d=null;a._version="2.0.6";a._prefixes=
i;a._domPrefixes=o;a.testProp=function(a){return e([a])};a.testAllProps=function(a,b){var d=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+o.join(d+" ")+d).split(" ");return e(d,b)};a.testStyles=function(a,d,c,g){var e,i=b.createElement("div");if(parseInt(c,10))for(;c--;)e=b.createElement("div"),e.id=g?g[c]:"modernizr"+(c+1),i.appendChild(e);c=["&shy;<style>",a,"</style>"].join("");i.id="modernizr";i.innerHTML+=c;f.appendChild(i);a=d(i,a);i.parentNode.removeChild(i);return!!a};f.className=f.className.replace(/\bno-js\b/,
"")+(" js "+h.join(" "))})(window,document);var q,p,l,h,r,m,j,n;/MSIE [1-8]/i.test(navigator.userAgent)?(alert("This web app do not support your browser (IE below 9)!"+q),history.go(-1)):(h=window.menu={},l=h.mask={active:!1,el:$("#panel_mask"),show:function(a,b){var c,e=this;c=this.el.find(".msg");a?(c.html(a).show(),this.adj(),this.active="msg"):(c.hide(),this.active="loading");if(b)this.el.one("click",function(){return e.hide()});this.el.addClass("active")},hide:function(){var a=this;this.el.addClass("fade");
setTimeout(function(){a.el.removeClass("active fade");a.active=!1;return a.el.find(".msg").empty()},500)},adj:function(){var a;a=this.el.find(".msg");a.css({"margin-left":-a.outerWidth()/2,"margin-top":-a.outerHeight()/2})}},h.about=function(){var a;l.show('<div id="about">Loading ...</div>',!0);a=$("#demo-tip").hide(500);l.el.one("click",function(){return a.show(500)});$("#about").load("about.html",function(){return l.adj()})},n=h.svc={get_stores:function(a){return this.get("data/store-list.json",
null,{success:a,error:function(){return l.show('Get Store List Failed<br/><a href="javascript:location.reload()">Reload</a>')}})},get_menu:function(a,b){return this.get("data/store-"+a+".json",null,{success:b,error:function(){return l.show("Get Menu Data Failed")}})},submit_order:function(a){var b;sessionStorage.count=b=1+Number(sessionStorage.count||1E3);sessionStorage["order-"+b]=JSON.stringify(a);sessionStorage["order-html-"+b]=$("#step_review_checklist fieldset").html();l.show("<h1>Your Order #"+
b+'(DEMO) submited.<br/>Now redirecting to <a href="order.html?'+b+'">Conformation Page (DEMO)</a>...</h1>');setTimeout(function(){return n.forward("order.html?"+b)},1E3)},forward:function(a){location.replace(a)},get:function(a,b,c){return this.ajax({type:"GET",url:a,data:b,timeout:5E3},c)},ajax:function(a,b){l.show();return $.ajax($.extend({dataType:"json",contentType:"application/json;charset=utf-8",complete:function(a,e){null!=(null!=b?b.complete:void 0)&&b.complete();null!=h.debug&&console.log(a,
e);if("loading"===l.active)return l.hide()}},a,b))}},j=h.stores=[],p=h.calc=function(){var a,b,c,e,f,d,g,i;c=$("#store").val();a={};c=j.map[c];i=$("#menu_form").serializeArray();f=0;for(d=i.length;f<d;f++)if(b=i[f],c[b.name].single)a[b.name]=new Number(b.value);else{if(null==a[g=b.name])a[g]=[];a[b.name].push(Number(b.value))}a.price=0;for(e in a)b=a[e],"weight"===e?a.price+=b.price=c.weight[b].price:null!=c[e]&&(c[e].single?"bowl"===e&&c.free_bowl_weight===Number(a.weight)?b.price=0:a.price+=b.price=
c[e].price:(b.price=(b.length-c[e].free)*c[e].price,0>b.price&&(b.price=0),a.price+=b.price));return a},r=h.scroll=function(){var a;this.scroll_at_top=0===this.scrollTop;a=this.scrollHeight-this.scrollTop!==$(this).outerHeight();this.scrollable=this.scrollHeight>this.clientHeight&&a;$("#scroll_helper")[this.scrollable?"addClass":"removeClass"]("active");return!0},q="<br/>Google Chrome 15+, Mozilla Firefox 5+ and Apple Safari 5+ are recommended.",m=h.step={cur:0,init:function(){var a,b,c,e,f,d,g,i,
o,j,m,n,p,k=this;g=this.panel=$("#slide_panel").show();j=$("section.step");this.seq=[];n=0;for(p=j.length;n<p;n++)o=j[n],i=o.id.slice(5),b=this[i].idx=this.seq.length,this.seq.push(i),this[b]=this[i],this[i].name=i,this[i].el=$(o);c=this.length=this.seq.length;j.append('<div class="spacer"/>');$(window).resize(function(){var a;a=g.height();j.height(a).find("div.helper").css("top",a-85+"px")}).resize();this.go(this.cur);$("#prev").click(function(){return k.go(k.cur.idx-1)});$("#next").click(function(){return k.go(k.cur.idx+
1)});$("#apply").click(function(){return k.commit()});$("#undo").click(function(){return k.restore()});g.delegate('input.choice[name="bun"], input.choice[name="bowl"]',"change",function(){return $("input.choice[name="+("bun"===this.name?"bowl":"bun")+"]:checked").prop("checked",!1)});g.delegate("input.choice","change",function(){return k.choose_store.choice_change()});window.Touch?($("#prev").bind("touchstart",function(a){a.preventDefault();k.go(k.cur.idx-1);return!1}),$("#next").bind("touchstart",
function(a){a.preventDefault();k.go(k.cur.idx+1);return!1}),$("#apply").bind("touchstart",function(a){a.preventDefault();k.commit();return!1}),$("#undo").bind("touchstart",function(a){a.preventDefault();k.restore();return!1}),g.delegate("label.selection.single, label.selection.multi",{touchstart:function(a){a=a.originalEvent;this.spos={x:a.pageX,y:a.pageY};this.tap=!0},touchmove:function(a){a=a.originalEvent;this.tap=16>Math.abs(a.pageX-this.spos.x)&&16>Math.abs(a.pageY-this.spos.y)},touchend:function(){this.tap&&
$(this).find("input.choice").click();this.tap=this.spos=null}}),f=this,$(document.body).bind({touchstart:function(a){a=a.originalEvent;this.start_y=a.pageY},touchmove:function(a){var b,d;b=a.originalEvent;(null==(null!=(d=f.cur)?d.el:void 0)||b.pageY>this.start_y&&f.cur.el[0].scroll_at_top||b.pageY<this.start_y&&!f.cur.el[0].scrollable)&&a.preventDefault()}}),g.bind({touchstart:function(a){var b,a=a.originalEvent;this.spos={x:a.pageX,y:a.pageY};this.cur_left=parseInt($(this).css("left"));a=$("#next");
b=$("#prev");this.can_next=!a.prop("disabled")&&"none"!==a.css("display");this.can_prev=!b.prop("disabled")&&"none"!==b.css("display");return!0},touchmove:function(a){var b;if(null!=this.spos&&(a=a.originalEvent,b=100*(a.pageX-this.spos.x)*c/this.offsetWidth,0>b&&this.can_next||0<b&&this.can_prev))if(null!=this.mv||32<Math.abs(a.pageX-this.spos.x)&&128>Math.abs(a.pageY-this.spos.y))return this.mv=b,!1;return!0},touchend:function(){null!=this.spos&&null!=this.mv&&(15<Math.abs(this.mv)?$(0>this.mv?
"#next":"#prev").click():$(this).css("left",this.cur_left+"%"));this.spos=this.mv=null;return!0}})):$.browser.webkit&&(e=$("#next"),d=$("#prev"),m=0,a=null,b=function(b){var c,g,f;null!=h.debug&&console.log("delta,x,y:",b.wheelDelta,b.wheelDeltaX,b.wheelDeltaY);f=Math.abs(b.wheelDeltaX);c=Math.abs(b.wheelDeltaY);if(f){b.preventDefault();b.stopPropagation();if(120<=f){if(1===++m%120&&32>c&&(null!=h.debug&&console.log("wheeling",m),c=!e.prop("disabled")&&"none"!==e.css("display"),g=!d.prop("disabled")&&
"none"!==d.css("display"),f=b.wheelDeltaX,0>f&&c||0<f&&g))$(0>f?"#next":"#prev").click();b=function(){null!=h.debug&&console.log("stoped");a=a&&clearTimeout(a);return m=0};clearTimeout(a);a=setTimeout(b,300)}return!1}return!0},g[0].onmousewheel=b);window.opera?l.show("This web app does not support Opera quite well!"+q,!0):/MSIE 9/.test(navigator.userAgent)&&l.show("This web app only provide a limited UI on IE9!"+q,!0);return this},go:function(a){var b,c,e,f=this;this[a]&&this.cur!==this[a]&&(null!=
(null!=(b=this.cur)?b.leave:void 0)&&this.cur.leave(),null!=(null!=(c=this.cur)?c.el:void 0)&&this.cur.el.unbind("scroll",r),a=this[a].idx,this.prev=0<a?this[a-1]:null,this.cur=this[a],this.next=a<this.length-1?this[a+1]:null,this.show((e=this.cur.idx)===a-1||e===a||e===a+1?!0:void 0),this.cur.el.bind("scroll",r),this.cur.el.scroll(),window.onhashchange=$.noop,location.hash=this.cur.name,window.onhashchange=function(){var a;m=location.hash.replace("#","");a=$("#next");null==f[m]||l.active?location.hash=
f.cur.name:f.cur.idx===f.length-1||!a.prop("disabled")&&"none"!==a.css("display")?f.go(m):location.hash=f.cur.name});return this},show:function(){var a;a=this.cur.idx;this.panel.css("left",10-80*a+"%");$("#prev").prop("disabled",0===a);$("#next").prop("disabled",a===this.length-1);$("#float_price").css("opacity",0<a&&a<this.length-1?1:0);$("nav a.thumb.cur").removeClass("cur");$("nav a.thumb:eq("+a+")").addClass("cur");null!=this.cur.init&&this.cur.init();null!=this.cur.enter&&this.cur.enter();return this},
validate:function(){var a;if(null!=(null!=(a=this.cur)?a.validate:void 0))return this.cur.validate()},commit:function(){var a;if(null!=(null!=(a=this.cur)?a.commit:void 0))return this.cur.commit()},restore:function(){var a;if(null!=(null!=(a=this.cur)?a.restore:void 0))return this.cur.restore()},choose_store:{init:function(){this.get_stores_data();m.choose_store.init=null;return this},get_stores_data:function(){var a=this;n.get_stores(function(b){var c,e,f,d,g,i,o,h;j=b;j.tree={};j.map={};f=0;for(d=
j.length;f<d;f++)b=j[f],c=null!=(o=(e=j.tree)[g=b.state])?o:e[g]={},c=null!=(h=c[i=b.city])?h:c[i]=[],c.push(b),j.map[b.id]=b;return a.build_options()});return this},build_options:function(){var a,b,c,e,f=this;e=$("fieldset.info .store_info");a=$("fieldset.info .open_hours");$("#store").change(function(){var b;b=$("#store").val();b=j.map[b];f.validate();null!=b?(null==b.zip&&(b.zip=""),e.html("<strong>"+b.desc+"</strong><br/>"+b.addr.replace(/\n|\\n/g,"<br/>")+"<br/>"+b.city+", "+b.state+", "+b.zip+
"<br/>"+b.phone+"<br/>"+b.email),a.html(b.hours.replace(/\n|\\n/g,"<br/>"))):e.add(a).empty()});$("#city").change(function(){var a,b,c,f,e,h;a=$("#state").val();c=[];f=$("#store");if(a&&this.value){a=j.tree[a][this.value];e=0;for(h=a.length;e<h;e++)b=a[e],c.push('<option value="'+b.id+'">'+b.desc+"</option>")}1!==c.length&&c.unshift('<option value="">Please Select</option>');f.html(c.join("")).prop("disabled",1===c.length).change();1<c.length&&f.focus()});c=['<option value="">Please Select</option>'];
for(b in j.tree)c.push('<option value="'+b+'">'+b+"</option>");$("#state").html(c.join("")).change(function(){var a,c;b=j.tree[this.value];c=[];for(a in b)c.push('<option value="'+a+'">'+a+"</option>");1!==c.length&&c.unshift('<option value="">Please Select</option>');a=$("#city").html(c.join("")).prop("disabled",1===c.length).change();if(1<c.length)return a.focus()}).change().focus();$("#step_choose_store select").change(function(){return $(this).siblings(".value").text($("option:selected",this).text()).parents(".select")[this.disabled?
"addClass":"removeClass"]("disabled")}).change();return this},get_menu_data:function(a){var b,c,e=this;if(null!=a)return b=$("#apply").prop("disabled",!0),null!=j.map[a].type?this.build_menu(j.map[a]):(c={type:{1:"meat",2:"weight",3:"cheese",4:"topping",5:"premium_topping",6:"sauce",7:"bun",8:"bowl"},choice:{},meat:{single:!0},weight:{single:!0},bun:{single:!0},bowl:{single:!0}},n.get_menu(a,function(f){var d,g,i,h,f=$.extend(j.map[a],c,f);h=f.weights;g=0;for(i=h.length;g<i;g++)d=h[g],f.weight[d.id]=
d;h=f.types;g=0;for(i=h.length;g<i;g++)d=h[g],d.free=d.free||0,d.price=d.price||0,d.t=f.type[d.id],$.extend(d,f[d.t]),d.fields=$("#"+d.t+"_fields"),f[d.t]=f.type[d.id]=d;h=f.choices;g=0;for(i=h.length;g<i;g++)d=h[g],d.type=f.type[d.type],d.t=d.type.t,f.choice[d.id]=f[d.type.t][d.id]=d;e.build_menu(f);b.hide().prop("disabled",!0);$("#next").show().click();return f})),this},build_menu:function(a){var b,c,e,f,d,g;if(null!=(null!=a?a.type:void 0)){$("#slide_panel label.selection").remove();e=$("#weight_fields");
c=a.weights;g=0;for(b=c.length;g<b;g++)d=c[g],e.append('<label id="weight_'+d.id+'" class="selection single"><input type="radio" class="choice" id="weight_'+d.id+'_value" name="weight" value="'+d.id+'" data-price="'+d.price+'" /><span class="desc">'+d.desc+'</span><span class="info">'+d.price.toFixed(2)+"</span></label>");g=a.choices;b=e=0;for(d=g.length;e<d;b=++e)b=g[b],c=b.type.single?"single":"multi",f=b.type.single?"radio":"checkbox",b.type.fields.append('<label id="'+b.t+"_"+b.id+'" class="selection '+
c+'"><input type="'+f+'" class="choice" id="'+b.t+"_"+b.id+'_value" name="'+b.t+'" value="'+b.id+'" /><span class="desc">'+b.desc+"</span></label>");f=a.types;b=0;for(c=f.length;b<c;b++){d=f[b];g=d.fields.find("legend .info");if(1===g.length&&(null!=d.free||null!=d.price)&&"weight"!==d.t)e="",d.single?(0<d.price&&(e="+"+d.price.toFixed(2)),a.free_bowl_weight&&"bowl"===d.t&&(e+=" (except 1lb)")):(e=d.free?1===d.free?"Extra selection ":"Up to "+d.free+", extra selection ":"Each selection ",e+=d.price.toFixed(2)),
g.html(e);"weight"!==d.t&&d.fields.find("label.selection:lt(3)").each(function(a,b){return $(b).append('<span class="tops">Top'+(a+1)+"</span>")})}$("#meat_fields, #weight_fields, #bun_fields").find("input.choice:first").prop("checked",!0);this.choice_change();$(window).resize();window.onbeforeunload=function(){if(50<$("#menu_form").serialize().length)return"Really to leave?\nYour selections will be discard if you leave."}}return this},choice_change:function(){var a;$("label.selection.checked").removeClass("checked");
$("input.choice:checked").parent("label.selection").addClass("checked");a=p();$("span.burger_price").text(a.price.toFixed(2));return this},validate:function(){var a,b;b=$("#store").val();this.store_id&&(a=this.store_id!==b,$("#next, #prev")[a?"hide":"show"](),$("#undo, #store_change_warning, #apply")[a?"show":"hide"]());$("#next, #apply").prop("disabled",!b);return Boolean(b)},restore:function(){var a;null!=this.store_id&&null!=j.map[this.store_id]&&(a=j.map[this.store_id],$("#state").val(a.state).change(),
$("#city").val(a.city).change(),$("#store").val(a.id).change());return this},commit:function(){var a;a=$("#store").val()||null;null!=a&&a!==this.store_id&&(this.store_id=a,this.validate()&&this.get_menu_data(a));return this}},choose_burger:{},choose_cheeses:{},choose_toppings:{},choose_sauces:{},review_checklist:{init:function(){var a;$("#user_form").one("submit",function(a){var c,e;a.preventDefault();a.stopPropagation();this.disabled=!0;$("#prev").prop("disabled",!0);e=Number($("#store").val());
a=[p()];$("#email").val();Date.parse(Date());null!=h.debug&&Date.parse(Date());window.onbeforeunload=$.noop;c={store:e,burgers:a};c.price=c.price;null!=h.debug&&console.log(c);$("#popup_trace_user").removeClass("active");console.log(JSON.stringify(c,null,"\t"));h.submit=function(){return n.submit_order(c)};h.submit();if(0<h.debug)for(;--h.debug;)n.submit_order(c);return!1});a=$("#email");"undefined"!==typeof sessionStorage&&null!==sessionStorage&&sessionStorage.email&&a.val(sessionStorage.email);
a.prop("required")?$("#skip").click(function(){$("#email").removeAttr("required");return $("#user_form").submit()}):$("#skip").hide();$("#submit").one("click",function(){$("button.nav").prop("disabled",!0);setTimeout(function(){$("#panel_mask, #popup_trace_user").addClass("active");return $("#email").focus()},200);return!1});this.init=null;return this},enter:function(){var a,b,c,e;a=$("#store").val();c=j.map[a];b=p();null!=h.debug&&console.log(JSON.stringify(b));a=null!=b.bun?c.bun[b.bun].desc+" (On a Bun)":
c.bowl[b.bowl].desc+" (In a Bowl)";$("#review_burger div").html('<label class="selection">'+c.meat[b.meat].desc+'</label><label class="selection">'+c.weight[b.weight].desc+'</label><label class="selection">'+a+"</label>");$("#review_burger .price").text((b.weight.price+(null!=b.bowl?b.bowl.price:0)).toFixed(2));["cheese","topping","premium_topping","sauce"].forEach(function(a){var d,e,h;e=$("<div/>");null!=(d=b[a])&&d.length?b[a].forEach(function(b){return e.append('<label class="selection">'+c[a][b].desc+
"</label>")}):e.append('<label class="selection">None</label>');d=$("#review_"+a);d.find("div").replaceWith(e);return d.find(".price").text(((null!=(h=b[a])?h.price:void 0)||0).toFixed(2))});$("#burger_price").text(b.price.toFixed(2));e=(100*c.tax_rate).toFixed(5).replace(/.?0+$/,"");a=Math.round(100*b.price*c.tax_rate)/100;c.tax_rate&&$("#tax_rate").text("("+e+"%)");$("#tax").text(a.toFixed(2));$("#total_price").text((b.price+a).toFixed(2));return this}}},m.init(),console.log(11))}).call(this);
