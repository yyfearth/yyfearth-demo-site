/*!
* Combo-Box powered by Wilson@yyfearth.com
* filename: combo-box.js
* last update: 2012-08-04 00:12:44
*/
(function(){var h,n;n=function(e,f){return setTimeout(f,e)};h=function(e,f,g){return e.addEventListener(f,g,!1)};window.init_combo=function(){var e,f,g,d,c,m,j,k,l,o,i;null==this.values&&(this.values="");console.log(""+this.attributes.values);i=(null!=(f=this.dataset)?f.values:void 0)||this.getAttribute("data-values")||this.getAttribute("values")||"";i||(this.value="");if(this.values===i)return this;this.values=i;e=this;l=null;o=[];null!=this.list?(c=this.list,d=c.querySelectorAll("li"),d=[].slice.call(d,1),d.forEach(function(a){return a.parentNode.removeChild(a)})):(c=this.list=document.createElement("ul"),c.className="combo wrap",this.autocomplete="off",this.parentNode.insertBefore(c,this),this.parentNode.removeChild(this),f=document.createElement("li"),f.appendChild(this),c.appendChild(f),h(c,"click",function(a){a.stopPropagation();a.preventDefault();a.target===e?k():j(a.target);return false}),j=function(a){var b;if(a.dataset.val){e.value=a.dataset.val;b=c.querySelector("li.cur");if(b!==a){b!=null&&b.classList.remove("cur");a.classList.add("cur")}return g()}},k=function(){clearTimeout(l);c.classList.add("active");e.classList.add("dropdown");return false},g=function(){clearTimeout(l);l=n(100,function(){c.classList.remove("active");return e.classList.remove("dropdown")});return false},m=function(a){var b;b=c.querySelector("li.cur");if(b!=null){b.classList.remove("cur");b=a<0?b!==d[0]?b.previousSibling:d[d.length-1]:b.nextSibling||d[0]}else b=d[0];b.classList.add("cur");return false},h(this,"focus",function(a){if(!this.value)return k(a)}),h(this,"keydown",function(a){if(c.classList.contains("active"))switch(a.keyCode){case 40:return m(1);case 38:return m(-1);case 27:return g();case 13:a.stopPropagation();a.preventDefault();a=c.querySelector("li.cur");a!=null&&j(a);return false}else if(a.keyCode===40)return k(a)}),h(this,"blur",g));d=i.split(",").map(function(a){var b;o.push(a=a.trim());b=document.createElement("li");b.innerText=b.textContent=b.dataset.val=a;c.appendChild(b);return b});this.value||j(d[0]);return this}}).call(this);
