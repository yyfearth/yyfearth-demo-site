define("lib/bootstrap-wysiwyg",["lib/common"],function(){!function(e){"use strict";var t=function(t){var i=e.Deferred(),n=new FileReader;return n.onload=function(e){i.resolve(e.target.result)},n.onerror=i.reject,n.onprogress=i.notify,n.readAsDataURL(t),i.promise()};e.fn.cleanHtml=function(){var t=e(this).html();return t&&t.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/,"")},e.fn.wysiwyg=function(i){var n,r,o,s=this,a=function(){r.activeToolbarClass&&e(r.toolbarSelector).find(o).each(function(){var t=e(this).data(r.commandRole);document.queryCommandState(t)?e(this).addClass(r.activeToolbarClass):e(this).removeClass(r.activeToolbarClass)})},l=function(e,t){var i=e.split(" "),n=i.shift(),r=i.join(" ")+(t||"");document.execCommand(n,0,r),a()},c=function(){s.keydown(function(e){var t=null;if(e.ctrlKey||e.metaKey)switch(e.which){case 66:t="bold";break;case 73:t="italic";break;case 85:t="underline";break;case 90:t=e.shiftKey?"redo":"undo";break;case 98:t="redo"}else 9==e.which&&(t=e.shiftKey?"outdent":"indent");return t?(e.preventDefault(),e.stopPropagation(),l(t),!1):!0})},u=function(){var e=window.getSelection();return e.getRangeAt&&e.rangeCount?e.getRangeAt(0):void 0},d=function(){n=u()},h=function(){var e=window.getSelection();if(n){try{e.removeAllRanges()}catch(ex){document.body.createTextRange().select(),document.selection.empty()}e.addRange(n)}},p=function(i){s.focus(),e.each(i,function(i,n){/^image\//.test(n.type)?e.when(t(n)).done(function(e){l("insertimage",e)}).fail(function(e){r.fileUploadError("file-reader",e)}):r.fileUploadError("unsupported-file-type",n.type)})},f=function(e,t){h(),document.queryCommandSupported("hiliteColor")&&document.execCommand("hiliteColor",0,t||"transparent"),d(),e.data(r.selectionMarker,t)},m=function(t,i){t.find(o).click(function(){h(),s.focus(),l(e(this).data(i.commandRole)),d()}),t.find("[data-toggle=dropdown]").click(h),t.find("input[type=text][data-"+i.commandRole+"]").on("webkitspeechchange change",function(){var t=this.value;this.value="",h(),t&&(s.focus(),l(e(this).data(i.commandRole),t)),d()}).on("focus",function(){var t=e(this);t.data(i.selectionMarker)||(f(t,i.selectionColor),t.focus())}).on("blur",function(){var t=e(this);t.data(i.selectionMarker)&&f(t,!1)}),t.find("input[type=file][data-"+i.commandRole+"]").change(function(){h(),"file"===this.type&&this.files&&this.files.length>0&&p(this.files),d(),this.value=""})},_=function(){s.on("dragenter dragover",!1).on("drop",function(e){var t=e.originalEvent.dataTransfer;e.stopPropagation(),e.preventDefault(),t&&t.files&&t.files.length>0&&p(t.files)})};return r=e.extend({},e.fn.wysiwyg.defaults,i),o="a[data-"+r.commandRole+"],button[data-"+r.commandRole+"],input[type=button][data-"+r.commandRole+"]",c(),r.dragAndDropImages&&_(),m(e(r.toolbarSelector),r),s.attr("contenteditable",!0).on("mouseup keyup mouseout",function(){d(),a()}),e(window).bind("touchend",function(e){var t=s.is(e.target)||s.has(e.target).length>0,i=u(),n=i&&i.startContainer===i.endContainer&&i.startOffset===i.endOffset;(!n||t)&&(d(),a())}),this},e.fn.wysiwyg.defaults={toolbarSelector:"[data-role=editor-toolbar]",commandRole:"edit",activeToolbarClass:"btn-info",selectionMarker:"edit-focus-marker",selectionColor:"darkgrey",dragAndDropImages:!0,fileUploadError:function(e,t){console.log("File upload error",e,t)}}}(window.jQuery)}),define("lib/bootstrap-fileupload",["lib/common"],function(){"use strict";!function(e){var t=function(t,i){if(this.$element=e(t),this.type=this.$element.data("uploadtype")||(this.$element.find(".thumbnail").length>0?"image":"file"),this.$input=this.$element.find(":file"),0!==this.$input.length){this.name=this.$input.attr("name")||i.name,this.$hidden=this.$element.find('input[type=hidden][name="'+this.name+'"]'),0===this.$hidden.length&&(this.$hidden=e('<input type="hidden" />'),this.$element.prepend(this.$hidden)),this.$preview=this.$element.find(".fileupload-preview");var n=this.$preview.css("height");"inline"!=this.$preview.css("display")&&"0px"!=n&&"none"!=n&&this.$preview.css("line-height",n),this.original={exists:this.$element.hasClass("fileupload-exists"),preview:this.$preview.html(),hiddenVal:this.$hidden.val()},this.$remove=this.$element.find('[data-dismiss="fileupload"]'),this.$element.find('[data-trigger="fileupload"]').on("click.fileupload",e.proxy(this.trigger,this)),this.listen()}};t.prototype={listen:function(){this.$input.on("change.fileupload",e.proxy(this.change,this)),e(this.$input[0].form).on("reset.fileupload",e.proxy(this.reset,this)),this.$remove&&this.$remove.on("click.fileupload",e.proxy(this.clear,this))},change:function(e,t){if("clear"!==t){var i=void 0!==e.target.files?e.target.files[0]:e.target.value?{name:e.target.value.replace(/^.+\\/,"")}:null;if(!i)return this.clear(),void 0;if(this.$hidden.val(""),this.$hidden.attr("name",""),this.$input.attr("name",this.name),"image"===this.type&&this.$preview.length>0&&("undefined"!=typeof i.type?i.type.match("image.*"):i.name.match(/\.(gif|png|jpe?g)$/i))&&"undefined"!=typeof FileReader){var n=new FileReader,r=this.$preview,o=this.$element;n.onload=function(e){r.html('<img src="'+e.target.result+'" '+("none"!=r.css("max-height")?'style="max-height: '+r.css("max-height")+';"':"")+" />"),o.addClass("fileupload-exists").removeClass("fileupload-new")},n.readAsDataURL(i)}else this.$preview.text(i.name),this.$element.addClass("fileupload-exists").removeClass("fileupload-new")}},clear:function(e){if(this.$hidden.val(""),this.$hidden.attr("name",this.name),this.$input.attr("name",""),navigator.userAgent.match(/msie/i)){var t=this.$input.clone(!0);this.$input.after(t),this.$input.remove(),this.$input=t}else this.$input.val("");this.$preview.html(""),this.$element.addClass("fileupload-new").removeClass("fileupload-exists"),e&&(this.$input.trigger("change",["clear"]),e.preventDefault())},reset:function(){this.clear(),this.$hidden.val(this.original.hiddenVal),this.$preview.html(this.original.preview),this.original.exists?this.$element.addClass("fileupload-exists").removeClass("fileupload-new"):this.$element.addClass("fileupload-new").removeClass("fileupload-exists")},trigger:function(e){this.$input.trigger("click"),e.preventDefault()}},e.fn.fileupload=function(i){return this.each(function(){var n=e(this),r=n.data("fileupload");r||n.data("fileupload",r=new t(this,i)),"string"==typeof i&&r[i]()})},e.fn.fileupload.Constructor=t,e(document).on("click.fileupload.data-api",'[data-provides="fileupload"]',function(t){var i=e(this);if(!i.data("fileupload")){i.fileupload(i.data());var n=e(t.target).closest('[data-dismiss="fileupload"],[data-trigger="fileupload"]');n.length>0&&(n.trigger("click.fileupload"),t.preventDefault())}})}(window.jQuery)}),function(){"use strict";var e={}.hasOwnProperty,t=function(t,i){function n(){this.constructor=t}for(var r in i)e.call(i,r)&&(t[r]=i[r]);return n.prototype=i.prototype,t.prototype=new n,t.__super__=i.prototype,t},i=[].slice;define("report",["base","models"],function(i,n){var r,o,s,a,l,c,u,d;return s=i.ROOT,c=i.find,u=i.tpl,l=i.fill,o=i.ModalDialogView,r=n.Content,a=function(i){function n(){return d=n.__super__.constructor.apply(this,arguments)}return t(n,i),n.prototype.el="#report_viewer",n.prototype.goBackOnHidden="content",n.prototype.events={"click .nav-tabs li.disabled":function(e){return e.stopImmediatePropagation(),!1},"click #stacked_options .btn":function(){var e=this;setTimeout(function(){var t,i;t=e.$accumulative.hasClass("active"),i=e.$daily.hasClass("active"),i!==e._daily&&(e._records_chart=null),(t!==e._accumulative||null==e._records_chart)&&(e._accumulative=t,e._daily=i,e._renderRecords())},100)}},n.prototype.initialize=function(e){var t=this;return n.__super__.initialize.call(this,e),this.$accumulative=$(c("#option_accumulative",this.el)),this.$daily=$(c("#option_daily",this.el)),this._renderRecords=_.debounce(this._renderRecords.bind(this),300),this.$el.find("a[data-toggle=tab]").on("shown",function(e){return t.trigger("tab:"+e.target.target),$(window).resize()}),this},n.prototype.popup=function(e,t){var i;return n.__super__.popup.call(this,e,t),this.model=e,i=e.get("records"),(null!=i?i.length:void 0)>2||(i=this._genRandReports(),e.set("records",i)),this.once({shown:function(){this._renderOverview(),this._renderRecords(),this._renderAnalysis(),this._renderSubmissions()},hide:function(){this._records_chart&&this.renderChart("#stacked","area",[],{chart:this._records_chart}),this._overview_chart&&this.renderChart("#overview_chart","bar",[],{chart:this._overview_chart})}}),this},n.prototype._disableTab=function(e){this.$el.find("[target="+e+"]").removeAttr("href").parent("li").addClass("disabled")},n.prototype._record_map={likes_count:"Facebook Likes",comments_count:"Facebook Comments",shares_count:"Facebook Shares",view_count:"Page View",submissions_count:"Submission"},n.prototype._section_tpl=u("#t_section"),n.prototype._renderOverview=function(){var t,i,n,r,o,s,a,l,c,u=this;if(s=this.model.get("records"),t=this.$el.find("#overview_chart .title"),null!=s?s.length:void 0){r=s.slice(-1)[0],console.warn("overview",r,s),a=new Date(r.created_at),n=new Date(s[0].created_at),this.$el.find("#overview_chart .title").text(""+n.toLocaleString()+" - "+a.toLocaleString()),l=[],c=this._record_map;for(i in c)e.call(c,i)&&(o=c[i],r[i]&&l.push({name:o,value:r[i]}));this.renderChart("#overview_chart","bar",[{values:l}],{chart:this._overview_chart,callback:function(e){return u._overview_chart=e}})}else t.text("No Records Yet")},n.prototype._renderTab=function(e,t,i){var n;n=this.model.get(t),(null!=n?n.length:void 0)?$(e).is(":visible")?i(n,e):this.once("tab:"+e,function(){return i(n,e)}):this._disableTab(e)},n.prototype._renderRecords=function(){var t=this;return this._renderTab("#report_feedback","records",function(i){var n,r,o,s,a,l,c,u,d,h,p,f,m,_,v,g,y,w,b,$,x,k,C;n=t.$accumulative.hasClass("active"),o=t.$daily.hasClass("active"),d={},a=[],C=t._record_map;for(c in C)e.call(C,c)&&(h=C[c],a.push({key:h,values:d[c]=[]}));if(o){for(g=0,$=i.length;$>g;g++)if(p=i[g],f=new Date(p.created_at),s=f.toLocaleDateString(),isNaN(f.getTime()))console.error("invalide date in record",p);else for(c in p)e.call(p,c)&&(r=p[c],h=c+"-"+s,c=d[c],null!=c&&(m=d[h],null==m?c.push(d[h]={ts:new Date(s).getTime(),count:r}):r>m.count&&(m.count=r)));if(!n)for(y=0,x=a.length;x>y;y++)for(_=a[y].values,u=w=_.length-1;w>=0;u=w+=-1)l=_[u],u&&(l.count-=_[u-1].count)}else for(b=0,k=i.length;k>b;b++)if(p=i[b],f=new Date(p.created_at).getTime(),isNaN(f))console.error("invalide date in record",p);else for(c in p)e.call(p,c)&&(r=p[c],c=d[c],null!=c&&(n?c.push({ts:f,count:r}):(v=c.length?c[c.length-1]._count:0,c.push({ts:f,count:r-v,_count:r}))));console.log("parsed records",a),t.renderChart("#stacked","area",a,{chart:t._records_chart,daily:o,callback:function(e){return t._records_chart=e}})})},n.prototype._renderAnalysis=function(){var e=this;return this._renderTab("#report_analysis","sections",function(t,i){var n,r;r=e.model.get("submissions"),n=e.$el.find(i),(null!=r?r.length:void 0)?e._loadRefSubmissions(t,function(){var i,o,s,a,c,d,h,p,f,m,_,v,g,y,w,b,x,k,C;for(c=[],s=_=0,w=t.length;w>_;s=++_)d=t[s],"radio"===d.type.toLowerCase()&&c.push({name:d.name,options:d.submission_options||d.options.manual_options,index:{},i:s});for(v=0,b=r.length;b>v;v++)for(h=r[v],g=0,x=c.length;x>g;g++)a=c[g],p=null!=(C=h.sections[a.i])?C:"",null==(m=a.index)[p]&&(m[p]=0),a.index[p]++;for(o=$("<div>"),u=e._section_tpl,y=0,k=c.length;k>y;y++)a=c[y],i=$(l(u,{i:a.i,name:a.name})),f=a.options.map(function(e,t){return e.id?{name:e.sections[0]||e.desc,value:a.index[e.id]||0}:{name:e,value:a.index[t]||0}}),e.renderChart("#pie_"+a.i,"pie",f),e.renderChart("#bar_"+a.i,"bar",[{values:f}]),o.append(i);return n.empty().append(o)}):n.html('<div class="text-center"><em class="muted">No submission yet</em></div>')})},n.prototype._loadRefSubmissions=function(e,t){var i;i=[],e.forEach(function(e){var t,n;return"radio"===e.type.toLowerCase()&&(t=null!=(n=e.options)?n.gen_from_submission:void 0)&&null==e.submission_options?i.push(new r({id:t}).fetch({success:function(t){var i,n,r,o,s;if(r=t.get("submissions")){for(i={},o=0,s=r.length;s>o;o++)n=r[o],i[n.id]=n;e.submission_options=r,e.submission_index=i}},error:function(){return console.error("failed to get submissions from",t,e)}})):void 0}),$.when.apply($,i).then(t,t)},n.prototype._renderSubmissions=function(){var e=this;return this._renderTab("#report_submissions","sections",function(t,i){var n,r;r=e.model.get("submissions"),n=e.$el.find(i),console.warn(n[0]),(null!=r?r.length:void 0)?e._loadRefSubmissions(t,function(){var e,i,o,a,l,c,u,d,h,p,f,m,v,g,y,w,b,x,k,C,T;for(l=[],a=$("<tr>").append("<th>#</th>"),c=v=0,w=t.length;w>v;c=++v)h=t[c],h.type&&"none"!==h.type.toLowerCase()&&(a.append($("<th>",{text:h.name})),h.index=c,l.push(h));for(a.append("<th>Submitted By</th><th>Submitted At</th>"),o=$("<table>",{class:"table table-hover"}).append(a),c=g=0,b=r.length;b>g;c=++g)if(p=r[c],null!=(k=p.sections)?k.length:void 0){for(i=$("<tr>").append($("<td>",{text:c+1})),y=0,x=l.length;x>y;y++)if(h=l[y],u=h.index,f=h.type,d=h.options,i.append(e=$("<td>")),m=p.sections[u],null!=m)switch(f.toLowerCase()){case"file":e.append($("<a>",{class:"icon-download",href:""+s+"/"+m+"/download",text:"Download"})),e.append(" "),e.append($("<a>",{class:"icon-link-ext",href:""+s+"/"+m,target:"_blank"}));break;case"radio":d.gen_from_submission?(m=null!=(C=h.submission_index)?C[m]:void 0)?e.html("Submission: "+_.escape(m.sections[0]||"")+" "+m.desc):e.text("(error)"):(null!=(T=d.manual_options)?T.length:void 0)&&e.text(d.manual_options[m]);break;case"html":e.text($("<div>").html(m).text());break;default:e.text(_.escape(m))}else e.addClass("muted").text("-");i.append($("<td>",{text:""+p.name+" <"+p.key+">"})),i.append($("<td>",{text:new Date(p.created_at).toLocaleString()})),o.append(i)}return n.empty().append(o)}):n.html('<div class="text-center"><em class="muted">No submission yet</em></div>')})},n.prototype.reset=function(){var e;return e=this.$el.find(".modal-header .nav-tabs a[data-toggle=tab]").each(function(){var e;(e=$(this)).attr("href",e.attr("target")).parent("li").removeClass("disabled")}),e.eq(0).tab("show"),this},n.prototype.render=function(){return this.reset(),n.__super__.render.apply(this,arguments)},n.prototype.renderChart=function(e,t,i,n){var r,o,s,a,l,c,u=this;if(c=this._initChart){if(a=c.nv,o=c.d3,s=c[t],!c.hasOwnProperty(t)||"function"!=typeof s)throw new Error("unsupported chart type "+t);(r=null!=n?n.chart:void 0)?(l=o.select(e+">svg"),(null!=i?i.length:void 0)?l.datum(i).transition().duration(300).call(r):l.selectAll("*").remove(),null!=n&&"function"==typeof n.callback&&n.callback(r)):a.addGraph(function(){return r=s(n),o.select(e+">svg").datum(i).transition().duration(300).call(r),a.utils.windowResize(r.update),null!=n&&"function"==typeof n.callback&&n.callback(r),r})}else require(["lib/d3v3","lib/nvd3"],function(o,s){var a;return a=o.format(",d"),u._initChart={d3:o,nv:s,pie:function(e){return r=s.models.pieChart().x(function(e){return e.name}).y(function(e){return e.value||0}).color(o.scale.category10().range()).labelType((null!=e?e.labelType:void 0)||"percent"),r.valueFormat(a),r},bar:function(){return r=s.models.discreteBarChart().x(function(e){return e.name}).y(function(e){return e.value||0}).staggerLabels(!0).showValues(!0),r.valueFormat(a).yAxis.tickFormat(a).tickSize(1),r},area:function(e){var t;return r=s.models.stackedAreaChart().useInteractiveGuideline(!0).x(function(e){return e.ts}).y(function(e){return e.count||0}),t=o.time.format((null!=e?e.daily:void 0)?"%x":"%x %-I:00%p"),r.xAxis.tickFormat(function(e){return t(new Date(e))}),r.yAxis.tickFormat(a),r}},u.renderChart(e,t,i,n)});return this},n.prototype._genRandReports=function(){var e,t,i,n,r,o,s,a,l,c,u,d,h,p;for(s=[],i=Object.keys(this._record_map),a=Date.now(),a-=a%36e6,l={},u={likes_count:10,comments_count:5,shares_count:5,view_count:3,submissions_count:1},c=0,h=i.length;h>c;c++)t=i[c],l[t]=0;for(e=100+1e3*Math.random()|0,e-=e%24;--e;){for(o={created_at:a},a+=36e5,d=0,p=i.length;p>d;d++)t=i[d],n=u[t],r=Math.random()>Math.min(n/10,.9)?0:1+Math.random()*n|0,o[t]=l[t]+=r;s.push(o)}return s},n}(o)}),define("content",["base","models","manager","report","lib/jquery-ui","lib/bootstrap-fileupload","lib/bootstrap-wysiwyg"],function(e,n,r,o){var s,a,l,c,u,d,h,p,f,m,v,g,y,w,b,x,k,C,T,S,L,E,R,D,F,O,P,A,H,N,M,j,V,z,I,q,B,G,K,U;return P=e.find,A=e.findAll,H=e.tpl,N=e.tplAll,O=e.fill,F=e.View,l=e.BoxView,w=e.FrameView,b=e.InnerFrameView,C=e.ModalDialogView,y=e.FormViewMixin,g=e.FormDialogView,m=n.Contents,u=n.Content,x=r.ManagerView,T=r.NavFilterView,E=r.ProjectFilterView,p=function(e){function i(){return M=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.prototype.initialize=function(e){return i.__super__.initialize.call(this,e),this.manager=new f({el:this.el,parent:this}),this.editor=new k({el:"#msg_editor",parent:this}),this.composer=new v({el:"#email_composer",parent:this}),this.designer=new L({el:"#page_designer",parent:this}),this.reporter=new o({el:"#report_viewer",parent:this}),this},i.prototype.open=function(e,t){return e?this.popup(e,t,function(e,t){return"save"===e?t.save({},{success:function(e){return console.log("saved",e)},error:function(){return console.error("save failed")}}):console.log(e,t)}):(this.manager.rendered||this.manager.render(),this.designer.cancel(),this.editor.cancel(),this.composer.cancel(),this.reporter.cancel()),this},i.prototype.popup=function(e,t,i){var n,r,o=this;return"string"==typeof e?(new u({id:e}).fetch({success:function(e){return o.popup(e,t,i)}}),this):(e instanceof u||(e=new u(e)),r=e.type(),"report"===t?this.reporter.popup(e,i):(n=function(){switch(r){case"FACEBOOK":case"TWITTER":return this.editor;case"PAGE":return this.designer;case"EMAIL":return this.composer;default:throw new Error("unsupported media type "+r)}}.call(this),n.popup(e,t,i)),this)},i}(w),h=function(){function e(){}return e.prototype.goBackOnHidden="content",e.prototype.load=function(e,t,i){var n=this;if(e instanceof u)return this.popup(e,i);if("string"==typeof e)return new u({id:e}).fetch({success:function(e){return n.popup(e,t,i)}});throw new Error("content editor can only load a content model or an id string")},e}(),R=function(){function e(){}return e.prototype._fonts=["Serif","Sans","Arial","Arial Black","Courier","Courier New","Comic Sans MS","Helvetica","Impact","Lucida Grande","Lucida Sans","Tahoma","Times","Times New Roman","Verdana"],e.prototype.events={"click .btn.hyperlink":function(e){return setTimeout(function(){return $(e.currentTarget).siblings(".dropdown-menu").find("input").focus()},200)},"click .btn-switch":"_switch"},e.prototype.readOnlyHtml=function(e){return this.readOnly=e,this.$editor.attr("contenteditable",!e),this.$code.attr("readonly",e),this.$edits.prop("disabled",e),this},e.prototype.fillHtml=function(e){return this.$editor.html(e||""),this},e.prototype.readHtml=function(){return this.$code.is(":visible")?this.$code.val():this.$editor.cleanHtml()},e.prototype.resetHtml=function(){return this.$code.val(""),this._switch(!1),this.$el.find(".btn-switch").removeClass("active"),this},e.prototype._renderFonts=function(){var e,t,i,n,r,o,s,a;for(i=P(".fonts-select",this.el),i.innerHTML="",n=document.createDocumentFragment(),a=this._fonts,o=0,s=a.length;s>o;o++)t=a[o],r=document.createElement("li"),e=document.createElement("a"),e.dataset.edit="fontName "+t,e.style.fontFamily=t,e.textContent=t,r.appendChild(e),n.appendChild(r);i.appendChild(n)},e.prototype.renderRichEditor=function(){return this._renderFonts(),this.$el.find(".dropdown-menu input").click(function(){return!1}).change(function(){return $(this).parent(".dropdown-menu").siblings(".dropdown-toggle").dropdown("toggle")}).keydown(function(e){return 27===e.which&&(this.value="",$(this).change().parents(".dropdown-menu").siblings(".dropdown-toggle").dropdown("toggle")),!0}),this.$el.find("input[type=file]").each(function(){var e,t;return e=$(this),t=e.parents(".btn-edit"),e.width(t.outerWidth()).height(t.outerHeight())}),this.$editor=this.$el.find(".rich-editor").wysiwyg(),this.$code=this.$editor.siblings(".rich-editor-html").removeAttr("name"),this.$edits=this.$el.find(".btn-toolbar").find("[data-edit],.btn.dropdown-toggle,.btn-edit"),this.$edits.tooltip({container:this.el}),this},e.prototype._switch=function(e){var t,i;i=this.$editor,t=this.$code,"boolean"!=typeof e&&(e=!t.is(":visible")),e?(i.hide(),t.show().val(i.cleanHtml())):(t.hide(),i.show().html(t.val())),this.readOnly||this.$edits.prop("disabled",e)},e}(),k=function(e){function i(){return j=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.acts_as(h),i.prototype.popup=function(e,t,n){var r;return i.__super__.popup.call(this,e,n),this.field=this.form.message,this.fill(e),r=e.posted(),this.field.readOnly=r,this.btnSave.disabled=r,this},i.prototype.fill=function(e){var t,i;switch(i=e.type(),t=this.field,this.$el.find("small.media").text("("+i+")"),this.form.name.value=e.get("name"),t.value=e.get("message"),i){case"FACEBOOK":t.maxLength=65535,t.rows=10;break;case"TWITTER":t.maxLength=140,t.rows=5;break;default:console.warn("text editor is only for socal media, not for page or email!",i)}return this},i.prototype.read=function(){return this.field.value},i.prototype.save=function(){return this.data.set("message",this.read()),this.callback("save"),this.hide(!0),this},i}(g),v=function(e){function i(){return V=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.acts_as(h,R),i.prototype.popup=function(e,t,n){var r;return i.__super__.popup.call(this,e,n),this.fill(e),r=e.posted(),this.readOnlyHtml(r),this.$el.find("form :input").prop("readOnly",r),this.btnSave.disabled=r,this},i.prototype.fill=function(e){return i.__super__.fill.call(this,e.attributes),this.fillHtml(e.get("desc")),this},i.prototype.read=function(){var e;return e=i.__super__.read.apply(this,arguments),e.desc=this.readHtml(),e},i.prototype.save=function(){return this.data.set(this.read()),this.callback("save"),this.hide(!0),this},i.prototype.reset=function(){return i.__super__.reset.apply(this,arguments),this.resetHtml(),this},i.prototype.render=function(){return this.renderRichEditor(),i.__super__.render.apply(this,arguments)},i}(g),L=function(e){function n(){return z=n.__super__.constructor.apply(this,arguments)}return t(n,e),n.acts_as(h),n.prototype._preview_tpl=N("#preview_tpl"),n.prototype.events={"click #new_section":function(){return this.addSection()},"click .btn-save":"save","click .btn-preview":"togglePreview"},n.prototype.initialize=function(e){return n.__super__.initialize.call(this,e),this.previewEl=P(".container.preview",this.el),this.btnSave=P(".btn-save",this.el),this.btnPreview=P(".btn-preview",this.el),this.pageDesc=new S({el:P("#page_desc",this.el)}),this.submitOptions=null,this.sections=[],this.sectionsEl=P("#sections",this.el),$(this.sectionsEl).sortable({axis:"y",delay:150,distance:15,cancel:".box-content,.readonly"}),this},n.prototype.popup=function(e,t,i){var r,o,s,a,l,c,u;if(n.__super__.popup.call(this,e,i),this.model=e,r={name:e.get("name"),desc:e.get("desc"),sections:e.get("sections")||[],options:e.get("options")||{}},this.url="content/"+e.id,this.pageDesc.fill(r),null!=(c=this.submitOptions)&&c.fill(r.options),o=this.readonly=e.posted(),o&&this.sectionsEl.classList.add("readonly"),e.has("sections"))for(u=r.sections,a=0,l=u.length;l>a;a++)s=u[a],this.addSection(s);else this.readonly||this.addSection();return this.pageDesc.readOnlyHtml(o),this.$el.find("form :input").prop("readOnly",o),this.$el.find("#new_section, form select, form input[type=checkbox]").prop("disabled",o),this.btnSave.disabled=o,"preview"===t&&(this.showPreview(r),this.btnSave.disabled=!0),this},n.prototype.reset=function(){var e,t,i,r,o;for(n.__super__.reset.apply(this,arguments),r=this.sections,t=0,i=r.length;i>t;t++){e=r[t];try{null!=e&&e.remove()}catch(_error){}}return this.sections=[],this.sectionsEl.innerHTML="",this.pageDesc.reset(),null!=(o=this.submitOptions)&&o.reset(),this.previewEl.classList.remove("active"),this.btnPreview.classList.remove("active"),this.sectionsEl.classList.remove("readonly"),this.btnSave.disabled=!1,this.url="",this.readonly=!1,this},n.prototype.read=function(e){var t,n,r,o,s,l,c,u;if("function"!=typeof e)throw new Error("content editor read is async, callback is needed");for(c=function(e){var t,i;return t=$.Deferred(),e instanceof a?(i=setTimeout(function(){return console.warn("read box form timeout",e.id),t.reject(e)},100),e.submit(function(){return clearTimeout(i),t.resolve(e.read())})):(console.error("read invalid box form",e),t.reject(e)),t.promise()},n=[c(this.pageDesc)],u=A(".box.section",this.el),o=0,l=u.length;l>o;o++)r=u[o],s=r.dataset.idx,t=c(this.sections[s]),n.push(t);return $.when.apply(this,n).fail(function(){return e(null)}).done(function(){var t,n;return t=arguments[0],n=2<=arguments.length?i.call(arguments,1):[],e({name:t.name,desc:t.desc,sections:n})}),this},n.prototype.save=function(){var e=this;return this.previewEl.classList.contains("active")&&this.togglePreview(),this.read(function(t){return t?(console.log("save content",t),e.data.set(t),e.callback("save"),e.hide(!0)):void 0})},n.prototype.addSection=function(e){var t,i=this;return t=new D({idx:this.sections.length,readonly:this.readonly,parent:this}),t.render(),t.fill(e),this.sectionsEl.appendChild(t.el),this.sections.push(t),this.listenTo(t,"remove",function(){return i.sections[t.id]=null}),this},n.prototype.removeSection=function(e){return e.remove(),this},n.prototype.showPreview=function(e){if(!e)throw new Error("data is empty for gen preview");return console.log("show preview",e),this.previewEl.innerHTML=this._genPreview(e),this.previewEl.classList.add("active"),this.btnPreview.classList.add("active"),this},n.prototype.togglePreview=function(){var e,t,i,n=this;return t=this.previewEl.classList,e=this.btnPreview.classList,t.contains("active")?(t.remove("active"),e.remove("active"),this.btnSave.disabled=!1||this.readonly,this.router.navigate(this.url)):(this.router.navigate(this.url+"/preview"),this.readonly?(i=this.model.toJSON(),i.page_desc=i,this.showPreview(i)):(this.btnPreview.disabled=!0,this.read(function(i){return i?n.showPreview(i):(t.remove("active"),e.remove("active")),n.btnPreview.disabled=!1}))),this},n.prototype._genPreview=function(e){var t,i,n;return console.log("gen preview page",e),i=null!=(n=e.sections)?n.map(function(e,t){var i;return i=new D({idx:t}),i.genPreview(e)}):void 0,t=O(this._preview_tpl.page,{title:e.name,desc:e.desc,sections:i.join("\n")}),(null!=i?i.length:void 0)||(t=t.replace("form-actions","form-actions hide")),t},n.prototype.render=function(){var e;return this.pageDesc.render(),e=P(".modal-body",this.el),$(e).find(".btn[title]").tooltip({container:e}),n.__super__.render.apply(this,arguments)},n}(C),a=function(e){function i(){return I=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.acts_as(y),i.prototype.render=function(){return this.initForm(),i.__super__.render.apply(this,arguments)},i.prototype.reset=function(){return this.form.reset(),this},i}(l),S=function(e){function i(){return q=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.acts_as(R),i.prototype.fill=function(e){return i.__super__.fill.call(this,e),this.fillHtml(e.desc),this},i.prototype.read=function(){var e;return e=i.__super__.read.apply(this,arguments),e.desc=this.readHtml(),e},i.prototype.reset=function(){return i.__super__.reset.apply(this,arguments),this.resetHtml(),this},i.prototype.render=function(){return i.__super__.render.apply(this,arguments),this.renderRichEditor(),this},i}(a),c=function(){function e(){}return e.prototype.changeType=function(e){var t,i,n,r,o,s,a;if(e!==this._type){for(this.trigger("type_change",e,this._type),null==this.optionFields&&(this.optionFields=A(".option-field",this.el)),a=this.optionFields,o=0,s=a.length;s>o;o++)i=a[o],t=i.classList,r=e&&t.contains(e+"-option"),n=P("[data-option-required]",i),null!=n&&(n.required=r),r?t.remove("hide"):t.add("hide");this._type=e}return this},e}(),D=function(e){function i(){return B=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.acts_as(c),i.prototype.tagName="section",i.prototype.className="box section",i.prototype.tpl=H("#section_tpl"),i.prototype._preview_tpl=L.prototype._preview_tpl,i.prototype.events={"change select[name=type]":function(e){var t;this.readonly||(t=$(e.currentTarget),this._changeType(t.val()))},"change form input[name=name]":function(e){var t,i;i=e.currentTarget.value,t=P(".box-title",this.el),t.textContent=i?"Section: "+i:"New Section"},"change input, textarea, select":function(e){this.rendered&&!this.readonly&&this.trigger("change",e.target,this.data)}},i.prototype.initialize=function(e){if(i.__super__.initialize.call(this,e),this.idx=e.idx,null==this.id&&(this.id=e.id||this.idx),"number"==typeof this.id&&(this.id="section_"+this.id),!this.id)throw new Error("id must be given for a section");return this.readonly=e.readonly,this.updatePreview=_.debounce(this.updatePreview.bind(this),100),this},i.prototype._changeType=function(e){this.changeType(e),this.$typeEl.siblings("label.checkbox").css("visibility",e&&"none"!==e?"visible":"hidden")},i.prototype._bind=function(){var e,t,i,n,r=this;return this.$typeEl=$(this._find("type")),e=this._find("auto_gen"),t=this._find("gen_from_submission"),n=this._find("manual_options"),i=P("input[type=text]",n),e.onchange=function(){var e;return t.disabled=!this.checked,e=n.classList,this.checked?(e.add("hide"),e.remove("radio-option"),t.select()):(e.remove("hide"),e.add("radio-option"),i.select()),!0},this.autoIncOptionList=new s({el:n,readonly:this.readonly}),this.listenTo(this.autoIncOptionList,"change",function(e){return r.trigger("change",e,r.data)}),this.previewEl=P(".preview",this.el),this.readonly||this.on("change fill reset",function(){return r.updatePreview(r.data)}),this},i.prototype._find=function(e){return P("#"+this.id+"_"+e,this.el)},i.prototype.fill=function(e){return this.reset(),e=null==e?{}:$.extend({},e,e.options),e.type=e.type?e.type.toLowerCase():"none",i.__super__.fill.call(this,e),/^radio$/i.test(e.type)&&!e.gen_from_submission&&e.manual_options&&(this._find("auto_gen").checked=e.gen_from_submission,this.autoIncOptionList.fill(e.manual_options)),this.readonly&&this._changeType(e.type),this.updatePreview(e),this},i.prototype.read=function(){var e,t,n;return(e=i.__super__.read.call(this))?(/^radio$/i.test(null!=e?e.type:void 0)&&(this._find("auto_gen").checked?delete e.manual_options:(delete e.gen_from_submission,e.manual_options=this.autoIncOptionList.read())),n=(e.type||"none").toUpperCase(),t=e,e={name:t.name,desc:t.desc,type:n,options:"NONE"===n?{}:t},delete t.name,delete t.desc,delete t.type,e):{}},i.prototype.render=function(){return this.rendered||(this.el.id=this.id,this.el.dataset.idx=this.idx,this.el.innerHTML=this.tpl.replace(/section_#/g,this.id),this._bind(),i.__super__.render.apply(this,arguments),this.readonly&&$(this.btn_close).remove()),this},i.prototype.reset=function(){return i.__super__.reset.apply(this,arguments),this._changeType("none"),this},i.prototype.genPreview=function(e){var t,i,n,r,o,s,a;switch(H=this._preview_tpl,s=e.type||"",o=e.options||e,s.toLowerCase()){case"":case"none":i="";break;case"text":i=o.text_multiline?H.textarea:H.text;break;case"html":i=H.html;break;case"radio":n=H.radio.replace("{{name}}",""+this.id+"_preview_radio"),r=o.gen_from_submission?["Submission 1 (Auto Genearted)","Submission 2 (Auto Genearted)","... (Auto Genearted)"]:o.manual_options||[],i=r.map(function(e){return n.replace("{{text}}",e)}).join("\n");break;case"file":t=o.file_accept,"image/*"===t?i=H.image:(t=t?"accept='"+t+"' ":"",i=H.file.replace(/accept(?:=['"]{2})?/,t));break;default:throw new Error("unknown section type "+s)}return H.section.replace("{{title}}",e.name||"(Need a Title)").replace("{{desc}}",(null!=(a=e.desc)?a.replace(/\n/g,"<br/>"):void 0)||"").replace("{{body}}",i)
},i.prototype.updatePreview=function(e){return null==e&&(e=this.read()),console.log("update preview",this.id,e),this.previewEl.innerHTML=Object.keys(e).length?this.genPreview(e):"",this},i}(a),s=function(e){function i(){return G=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.prototype.events={"input input.manual_option_text.new":function(e){var t;return t=e.target,t.value.trim()&&(t.classList.remove("new"),t.required=!0,t.dataset.optionRequired=!0,this._container.appendChild(this._tpl.cloneNode(!0)),this.trigger("change change:add",t,this)),!0},"click .close":function(e){var t,i;return e.preventDefault(),this.readonly||(t=$(e.target).parents(".manual_option"),i=t.find("input.manual_option_text").val(),t.remove(),this.trigger("change change:remove",t[0],i),this.validate()),!1},"blur input.manual_option_text":function(){return this.validate(!1)}},i.prototype.initialize=function(e){var t,n=this;if(i.__super__.initialize.call(this,e),this.readonly=e.readonly,H=P(".manual_option",this.el),!H)throw new Error("cannot find manual option tpl");return this._tpl=H.cloneNode(!0),t=P("input.manual_option_text[data-option-required]",this._tpl).dataset,delete t.optionRequired,this._container=P(".controls",this.el),this.readonly||$(this._container).sortable({axis:"y",delay:150,distance:5,cursor:"move",items:">.manual_option:not(:has(.new))",cancel:"input.manual_option_text",change:function(e,t){return n.trigger("change change:move",t.item[0],n)}}),this},i.prototype.fill=function(e){var t,i,n,r,o,s;if(null!=e?e.length:void 0){for(i=document.createDocumentFragment(),o=0,s=e.length;s>o;o++)r=e[o],t=this._tpl.cloneNode(!0),n=P("input.manual_option_text",t),n.value=r,n.classList.remove("new"),i.appendChild(t);$(this._container).prepend(i)}else console.error("values should be an string array",e);return this.validate(),this},i.prototype.read=function(){return this.validate(),this.values},i.prototype.validate=function(e){var t,i,n;return e=Boolean(e),t=this.$el.find("input.manual_option_text:not(.new)"),P("input.manual_option_text",this.el).required=!0,t.length?(n={},i=!0,t.removeClass("error").each(function(){var t;return t=this.value.trim(),t?n.hasOwnProperty(t)?(this.classList.add("error"),$(this).one("input",function(){return this.classList.remove("error")}),e||this.select(),i=!1,e):(this.value=t,n[t]=this,!0):(i=!1,!0)}),this.values=i?Object.keys(n):null,i):(this.values=null,!1)},i}(F),d=function(e){function i(){return K=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.prototype.render=function(){var e,t,n,r,o,s;return i.__super__.render.apply(this,arguments),e=this.model,r=e.type(),n=e.status(),t=this._find("report","a"),(null!=(s=e.get("records"))?s.length:void 0)||(null!=(o=e.get("submissions"))?o.length:void 0)?t.href="#content/"+e.id+"/report":this._hide(t),"IDLE"===n?(this._hide(t),"PAGE"!==e.get("type")&&this._hide("preview")):this._hide("edit"),this._hide("view"),this._hide("block"),this._hide("unblock"),this},i}(Backgrid.ActionsCell),f=function(e){function i(){return U=i.__super__.constructor.apply(this,arguments)}return t(i,e),i.prototype.columns=["id","name:content",{name:"type",label:"Media",cell:"label",cls:{page:"label-success icon-page",twitter:"label-twitter icon-twitter",facebook:"label-facebook icon-facebook",email:"label-info icon-mail"},editable:!1},"workflow","node_action",{name:"status",label:"Status",cell:"label",cls:{posted:"label-info"},editable:!1},{name:"posted_at",label:"Date Posted",cell:"readonly-datetime",editable:!1},{name:"content",label:"",editable:!1,sortable:!1,cell:d}],i.prototype.collection=new m,i.prototype.initialize=function(e){var t;return i.__super__.initialize.call(this,e),t=this.collection.fullCollection,this.typeFilter=new T({el:P(".type-filter",this.el),field:"type",collection:t}),this.projectFilter=new E({el:P("ul.project-list",this.el),collection:t}),this.refresh=this.refresh.bind(this),this},i.prototype.reload=function(){return i.__super__.reload.apply(this,arguments),this.typeFilter.clear(),this.projectFilter.clear()},i.prototype.render=function(){return i.__super__.render.apply(this,arguments),this.typeFilter.render(),this.projectFilter.render(),this},i}(x),p})}.call(this);