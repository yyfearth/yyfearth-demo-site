(function(){"use strict";var t={}.hasOwnProperty,e=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};define("project",["base","manager","models","diagram","actions"],function(t,n,i,r,o){var s,a,l,d,c,u,h,p,m,f,w,g,v,k,y,b,C,E,j,S,x,L,N;return N=t.find,C=t.View,l=t.FrameView,d=t.InnerFrameView,u=t.NavListView,a=t.FormView,s=t.FormDialogView,b=t.STATUS_CLS,c=n.ManagerView,S=n.WorkflowFilterView,E=i.Workflow,L=i.Workflows,p=i.Project,y=i.Projects,w=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.initialize=function(t){return n.__super__.initialize.call(this,t),this.editor=new f({el:"#project_editor",parent:this}),this.viewer=new k({el:"#project_viewer",parent:this}),this.manager=new g({el:"#project_manager",parent:this}),this.listenTo(this.manager,"create",function(t){return function(e){return t.editor.create(e)}}(this)),this},n.prototype._url_pattern=/(#project\/\w+(?:\/(?:node|link|action)\/\w+)*).*/,n.prototype.open=function(t,e){switch(t){case"new":this.editor.create(e);break;case"mgr":this.switchTo(this.manager);break;default:if(!t)throw new Error("open project with a name or id is needed");y.find({workflowId:t,fetch:!0,callback:function(n){return function(i){var r;r=i.workflow,r?(null!=e?e.edit:void 0)?n.editor.edit(r,e):(n.switchTo(n.viewer),n.viewer.load(r),n.viewer.select(e),n.viewer.btnEdit.href=location.hash.replace(n._url_pattern,"$1/edit")):(console.error("project with id "+t+" cannot found",t,e),alert("Project not found!"),n.router.navigate("project/mgr"),n.switchTo(n.manager))}}(this)})}return this},n}(l),f=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.goBackOnHidden="project/mgr",n.prototype.workflows=L.workflows,n.prototype.projects=y.projects,n.prototype.events={"change select[name=template_id]":function(t){var e,n;n=t.currentTarget.value,e=this.model.get("template_id"),this.$wfbtns.hide(),this.sidebar.classList.remove("active"),this.btnSave.disabled=!0,n?this.wfDiagram.draw(n===e&&this.model.loaded()?this.model:$(t.currentTarget).find(":selected").data("model")):this.wfDiagram.clear(),n&&null!=e?n===e?(this.sidebar.classList.add("active"),this.btnSave.disabled=!1):this.$wfbtns.show():e&&!n?this.$wfbtns.not(this.$btnSelect).show():n&&!e&&this.$btnSelect.show()},"click .btn-select":"_selectWorkflow","click .btn-revert":function(){this.form.template_id.value=this.model.get("template_id")||"",$(this.form.template_id).change()},"click li.sidebar-item > a, a.linked-item":function(t){return t.preventDefault(),this.navTo($(t.currentTarget).data("model")||t.currentTarget.dataset.item),!1}},n.prototype.initialize=function(t){var e;return n.__super__.initialize.call(this,t),this.sidebar=N(".sidebar",this.el),this.$btnSelect=$(N(".btn-select",this.form)),this.$wfbtns=this.$btnSelect.add(N(".btn-revert",this.form)),e=N("#wf_preview",this.el),this.$wfPreview=$(e),this.wfDiagram=new r({el:e}),this.listenTo(this.wfDiagram,"select",function(t){return function(e,n){t.model&&t.model.id===n.id&&t.navTo(e)}}(this)),this.$nodeLinkSection=$(N("section.node-link",this.el)),this.$projectForm=$(this.form),this.$actions=$(N(".node-actions",this.el)),this.dataEditor=new h({el:this.$nodeLinkSection[0],actionEl:this.$actions[0]}),this._renderSelect=_.throttle(this._renderSelect.bind(this),100,{trailing:!1}),this.on("shown",function(t){return function(){var e;e=t.form.template_id,e.value?t.form.name.select():e.focus()}}(this)),this},n.prototype.create=function(t){return t=(null!=t?t.id:void 0)||t,"string"!=typeof t&&(t=null),this.popup(new p({template_id:t}),null,function(t){return function(e){return"save"===e?(console.log("wf created",e,t.model),t.projects.create(t.model,{wait:!0}),t.trigger("create",t.model,t)):void 0}}(this)),this},n.prototype.edit=function(t,e){var n,i,r;if(null==e&&(e={}),i=e.link,r=e.node,n=e.action,n&&!r)throw new Error("cannot open a action without given a node");if(i&&r)throw new Error("node and link cannot be open together");return console.log("popup node/link editor",e),this.popup(t,e,function(t){return function(e,n){return"save"===e?(console.log("project saved",e,n),t.model.save(),t.trigger("edit",t.model,t)):void 0}}(this)),this},n.prototype.popup=function(t,e,i){var r,o,s,a,l,d;return d=null!=e?e:{},s=d.link,a=d.node,r=d.action,o=t.toJSON(),this.model=t,n.__super__.popup.call(this,o,i),l=this.form.template_id,l.disabled=!0,this.workflows.load(function(e){return function(n,i){var d,c;if("loaded"!==i&&e.sidebar.rendered||e._renderSelect(),e.fill(o),t.isNew()||(t.has("created_by")&&e.$el.find("#project_created_by").val(t.get("created_by")).parents(".control-group").show(),e.$el.find("#project_created_at").val(new Date(t.get("created_at")).toLocaleString()).parents(".control-group").show()),d=l.disabled=!t.isNew()||t.has("node_ids")||(null!=(c=t.nodes)?c.length:void 0),!d)return e._selectWorkflow();if(e._renderProject(t),a){if(e.navTo(t.nodes.get(a)),r)return e.dataEditor.viewAction(r)}else if(s)return e.navTo(t.links.get(s))}}(this)),this},n.prototype.navTo=function(t){var e,n,i,r,o,s;if(s=("string"==typeof t?t:null!=t?t._name:void 0)||"project",this._cur_type!==s){if(this.$projectForm.hide(),this.$actions.hide(),i=this.$nodeLinkSection.hide(),n=i.find(".node-options").hide(),e=i.find(".link-options").hide(),"project"===s)this.$projectForm.show(),t=null;else if("users"===s)this.$projectForm.show(),t=null;else if(i.show().find("input, textarea").prop("readOnly","IDLE"!==t.status()),"node"===s)this.$wfPreview.show(),this.$actions.show(),n.show();else{if("link"!==s)throw new Error("unknown type to nav "+s);e.show()}this._cur_type=s}else if(this._cur_model===t)return this;return this._readData(),this._cur_model=t,console.log("nav to",s,t),t&&this.dataEditor.fill(t),r=$(this.sidebar),r.find(".sidebar-item.active").removeClass("active"),o=r.find(t?".sidebar-item:has(a[data-cid='"+t.cid+"'])":".project-item").addClass("active"),o[0].scrollIntoViewIfNeeded(),this.wfDiagram.highlight(t),this},n.prototype._readData=function(){var t,e;(e=this._cur_model)&&(t=this.dataEditor.read(),console.log("data",t,"for",e),e.set(t),e._changed=!0)},n.prototype._selectWorkflow=function(){var t,e,n,i;e=this.form.template_id.value,e&&(e instanceof E||(e=this.workflows.get(e)),t=this.model,console.log("selected wf for project",e.name),n=function(e){return function(n){return n.isValid({traverse:!0})&&n.nodes.length?(t.copy(n,{traverse:!1}),t.set("status","IDLE"),e.form.name.value||(e.form.name.value=n.get("name"),$(e.form.name).trigger("input")),e.form.desc.value||(e.form.desc.value="Created from workflow "+n.get("name")),void e._renderProject(t)):(e.model.set("template_id",""),e.sidebar.classList.remove("active"),e.btnSave.disabled=!0,void setTimeout(function(){return alert("Cannot create project from workflow "+n.get("name")+", because it is broken or not finished yet.")},500))}}(this),console.log("cpy",e.loaded(),e),e.loaded()&&(null!=(i=e.nodes)?i.length:void 0)?n(e):e.fetch({reset:!0,success:n,error:function(){return alert("failed to load worklfow "+e.get("name"))}}))},n.prototype._renderProject=function(t){var e,n,i,r,o,s,a;this.sidebar.classList.add("active"),this.$wfbtns.hide(),s="IDLE"!==t.status(),this.btnSave.disabled=s,this.$projectForm.find("input, textarea").prop("readOnly",s),t.sort(),o=t.nodes,r=t.links,e=$(this.sidebar),e.find("li.node-item, li.link-item").remove(),i=document.createDocumentFragment(),a=this._renderSidebarItem.bind(this),o.forEach(function(t,e){return i.appendChild(a(t,e))}),n=document.createDocumentFragment(),r.forEach(function(t,e){return n.appendChild(a(t,e))}),e.find(".node-header").after(i),e.find(".link-header").after(n),this.sidebar.rendered=!0,this.wfDiagram.draw(t)},n.prototype._renderSidebarItem=function(t,e){var n,i,r,o;return r=document.createElement("li"),r.className="sidebar-item "+t._name+"-item",i=document.createElement("a"),o=i.textContent=""+(1+e)+". "+t.name(),i.dataset.cid=t.cid,n=$(i).data("model",t),o.length>15&&n.tooltip({title:o,placement:"right",container:this.el}),r.appendChild(i),r},n.prototype.reset=function(){return this.$wfbtns.hide(),this.$projectForm.find("input, textarea").prop("readOnly",!1),this.$el.find(".control-group:has(#project_created_at)").hide(),$(this.sidebar).find("li.node-item, li.link-item").remove(),this.navTo(null),n.__super__.reset.apply(this,arguments)},n.prototype._renderSelect=function(){var t,e,n,i,r;n=this.form.template_id,r=this.workflows.fullCollection,r.length&&(e=document.createElement("optgroup"),e.label="Owned Workflows",i=document.createElement("optgroup"),i.label="Shared Workflows",r.forEach(function(t){var n;return n=document.createElement("option"),n.value=t.id,n.textContent=t.get("name"),$(n).data("model",t),t.has("tanent_id")?e.appendChild(n):i.appendChild(n)}),n.innerHTML="",t=document.createElement("option"),t.value="",t.textContent="(Please Select)",n.appendChild(t),e.childElementCount&&n.appendChild(e),i.childElementCount&&n.appendChild(i))},n.prototype.save=function(){return this._readData(),this.data=this.read(),this.model.set(this.read()),this.callback("save"),this.hide(!0),this},n}(s),h=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.acts_as(o),n.prototype.initialize=function(t){return n.__super__.initialize.call(this,t),t.projectMode=!0,this.initActions(t),this.nameEl=N(".node-link-name",this.el),this.keyEl=N(".node-link-key",this.el),this.$inLinks=$(N("[name=in_links]",this.form)),this.$outLinks=$(N("[name=out_links]",this.form)),this.$prevNode=$(N("[name=prev_node]",this.form)),this.$nextNode=$(N("[name=next_node]",this.form)),this.$linkedNodeLinks=this.$inLinks.add(this.$outLinks.add(this.$prevNode.add(this.$nextNode))),this},n.prototype.fill=function(t){var e,i,r,o;return this.reset(),n.__super__.fill.call(this,t.attributes),o=this._renderLinked.bind(this),null!=t.actions?(e=t.name(),this.$inLinks.append((null!=(i=t.inLinks)?i.length:void 0)?t.inLinks.map(o):o(null)),this.$outLinks.append((null!=(r=t.outLinks)?r.length:void 0)?t.outLinks.map(o):o(null)),this.fillActions(t.actions())):(e="Link: "+t.name(),this.$prevNode.append(o(t.prevNode)),this.$nextNode.append(o(t.nextNode))),this.nameEl.textContent=e,this.keyEl.textContent=t.get("key"),this},n.prototype._renderLinked=function(t){var e;return t?(e=document.createElement("a"),e.className="btn btn-link linked-item",e.textContent=t.name(),$.data(e,"model",t)):(e=document.createElement("button"),e.className="btn btn-link",e.disabled=!0,e.textContent="(None)"),e},n.prototype.read=function(){var t;return t=n.__super__.read.apply(this,arguments),t.actions=this.readActions(),t},n.prototype.reset=function(){return this.clearActions(),this.$linkedNodeLinks.empty(),n.__super__.reset.apply(this,arguments)},n}(a),k=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.events={"click .status-btns > .btn":function(t){switch($(t.currentTarget).attr("name")){case"start":this.setStatus("started");break;case"stop":this.setStatus("stopped");break;case"pause":this.setStatus("paused");break;case"delete":this.destroy();break;default:throw new Error("unknown status action")}},"click .btn-reload":function(){null!=this.model&&(this.model.fetch({reset:!0}),this.router.navigate("project/"+this.model.id,{trigger:!0}))}},n.prototype.collection=y.projects,n.prototype.initialize=function(t){var e;return e=N(".wf-diagram",this.el),this.wfDiagram=new r({el:e}),this.statusView=new v({el:$(e).next()}),this.$title=$(N(".project-name",this.el)),this.$desc=$(N(".project-desc",this.el)),this.$status=$(N(".label-status > span",this.el)),this.btnEdit=N(".btn-edit",this.el),this.list=new u({el:N(".project-list",this.el),auto:!1,collection:this.collection,urlRoot:"project",seperator:"/",headerTitle:"Projects",defaultItem:!1,emptyItem:!1,allowEmpty:!1,itemClassName:"project-list-item"}),this.listenTo(this.list,"updated",function(t){return function(){return null!=t.model?t.list.$el.find("li:has(a[data-id='"+t.model.id+"'])").addClass("active"):void 0}}(this)),this.listenTo(this.wfDiagram,"select",function(t){return function(e){return t.router.navigate("project/"+t.model.id+"/"+e._name+"/"+e.id,{trigger:!0})}}(this)),this._updateStatus=this._updateStatus.bind(this),n.__super__.initialize.call(this,t)},n.prototype.load=function(t,e){return(e||this.model!==t)&&(console.log("load project",t),this.model&&this.stopListening(this.model),"string"==typeof t&&(t=this.collection.fullCollection.get(t)||new p({project:t})),this.model=t,this.listenTo(t,"loaded",this._render.bind(this)),this.rendered||this.render(),t.loaded()?this._render(t):t.fetch({reset:!0})),this},n.prototype._render=function(){var t,e,n,i,r;console.log("view project",this.model),n=this.model,this.$title.text(n.get("name")),this.$desc.text("("+((null!=(i=n.nodes)?i.length:void 0)||0)+" Nodes, "+((null!=(r=n.links)?r.length:void 0)||0)+" Links) "+n.get("desc")),this.btnEdit.href="#project/"+n.id+"/edit",this._updateStatus(),t=this.list.$el,e=t.find("li:has(a[data-id='"+n.id+"'])").addClass("active"),t.find("li.active").not(e).removeClass("active"),this.wfDiagram.draw(n),this.statusView.load(n,!0)},n.prototype._updateStatus=function(){var t,e,n;n=this.model.status(),e=function(){switch(n){case"IDLE":return"start, delete";case"STARTED":case"TRACKED":return"pause";case"PAUSED":return"start, stop";case"STOPPED":return"start, delete";case"FINISHED":return"";case"ERROR":return"start, delete";default:return console.error("unknow status",n),"delete"}}(),t=this.$el.find(".status-btns"),t.find(".btn").hide(),t.find(".btn[name=start]").text("PAUSED"===n?"Resume":"Start"),t.find(e.replace(/(\w+)/g,'.btn[name="$1"]')).show(),this.$status.text(n).parent().removeClass("label-success label-warning label-inverse label-info").addClass(b[n.toLowerCase()]||"")},n.prototype.destroy=function(){var t;return confirm("Are you sure to delete this project?\n\nThis step cannot be undone!")&&(this.model.destroy(),t=this.collection.at(0),t?this.load(t):this.router.back()),this},n.prototype.setStatus=function(t){return t?(t=t.toUpperCase(),t!==this.model.status()?this.model.status(t,{remote:!0,callback:function(t){return function(e){t._updateStatus(),e||alert("Failed to chanage status!")}}(this)}):console.log("status not changed",t)):this._updateStatus(),this},n.prototype.select=function(t){var e,n,i,r;if(null==t&&(t={}),i=t.link,r=t.node,e=t.action,e&&!r)throw new Error("cannot open a action without given a node");if(i&&r)throw new Error("node and link cannot be open together");return this.statusView.select(t),n=this.wfDiagram.highlight,r?n(r,"node"):i?n(i,"link"):n(null),this},n.prototype.render=function(){return this.statusView.render(),this.list.fetch(),n.__super__.render.apply(this,arguments)},n}(d),v=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype._prefix="prj_status_lst",n.prototype._cls=b,n.prototype.events={"dblclick li > a[href]":function(t){return this.router.navigate(t.currentTarget.href.replace(/^.*?#(project.*)/,"$1/edit"),{trigger:!0})},"click button[name=finish]":function(t){var e;confirm("Are you sure to force finish this action?\n\nIt will cause close submission and stop tracking.")&&(e=$.data(t.currentTarget,"model"),null!=e&&"function"==typeof e.status&&e.status("FINISHED",function(t){return function(e){"FINISHED"!==e?alert("Failed to force finish this action!"):t.model.load(function(){return setTimeout(function(){return t.select(t._cur_selected||{})},100)})}}(this)))}},n.prototype.initialize=function(t){return this.$list=$(N(".nodes-links-list",this.el)),this.$detail=$(N(".node-link-detail",this.el)),n.__super__.initialize.call(this,t)},n.prototype.load=function(t,e){return(e||this.model!==t)&&(this.model=t,this._renderList()),this},n.prototype.reset=function(){return this._cur_selected=null,this.load(null,!0)},n.prototype.select=function(t){var e,n,i,r,o,s,a,l;return s=null!=t?t:{},i=s.link,r=s.node,e=s.action,null==this.model?(console.error("model not given yet"),this):(this._cur_selected={link:i,node:r,action:e},o=this._prefix,r?(n="#"+o+"_node_"+r,this._renderNode(this.model.nodes.get(r)),e&&null!=(a=this.$detail.find("#"+o+"_action_"+e).addClass("active")[0])&&a.scrollIntoViewIfNeeded()):i?(n="#"+this._prefix+"_link_"+i,this._renderLink(this.model.links.get(i))):(this.$detail.empty(),n=null),this.$list.find("li.active").removeClass("active"),n&&null!=(l=this.$list.find(n).addClass("active")[0])&&l.scrollIntoViewIfNeeded(),this)},n.prototype._renderLabel=function(t,e){var n;return n=document.createElement("span"),n.className="label "+(e||""),n.textContent=t,n},n.prototype._renderListItem=function(t){var e,n,i,r,o,s,a,l;return s=t.workflow,i=document.createElement("li"),l=t._name||"",i.id=""+this._prefix+"_"+l+"_"+t.id,i.className="capitalized "+l,e=document.createElement("a"),e.href=t._href="#project/"+s.id+"/"+l+"/"+t.id,e.textContent=""+l+" "+(t.idx+1)+": ",n=document.createElement("i"),n.className="icon-right-open pull-right",e.appendChild(n),r=document.createElement("strong"),r.textContent=t.get("name")||("function"==typeof t.name?t.name().replace(/_/g," "):void 0),a=this._renderLabel,e.appendChild(r),t===s.startNode&&e.appendChild(a("(Start Node)","label-info start-node")),(o=t.status({lowercase:!0}))&&(e.className="status-"+o,e.appendChild(a(o.toUpperCase(),"pull-right "+this._cls[o]||""))),i.appendChild(e),i},n.prototype._renderHeaderItem=function(t){var e,n;return n=document.createElement("li"),n.className="list-header capitalized disabled text-center",e=document.createElement("a"),e.textContent=t,n.appendChild(e),n},n.prototype._renderList=function(t){var e,n,i;null==t&&(t=this.model),this.$list.empty(),t&&(t.sort(),n=this._renderHeaderItem,i=this._renderListItem.bind(this),e=document.createDocumentFragment(),t.nodes.length&&(e.appendChild(n("Nodes")),t.nodes.forEach(function(t,n){return null==t.idx&&(t.idx=n),e.appendChild(i(t))})),t.links.length&&(e.appendChild(n("Links")),t.links.forEach(function(t,n){return null==t.idx&&(t.idx=n),e.appendChild(i(t))})),this.$list.append(e))},n.prototype._renderNode=function(t){var e,n,i,r,o,s;this.$detail.empty(),t&&(o=this._prefix,r=this._renderLabel,i=null!=t._href?t._href:t._href="#project/"+t.workflow.id+"/node/"+t.id,n=this._cls,s=this._renderRefLink,e=document.createDocumentFragment(),e.appendChild(this._renderHeaderItem(""+t._name+" "+(t.idx+1)+": "+t.get("name"))),t.actions().forEach(function(t,a){var l,d,c,u,h,p,m;c=document.createElement("li"),c.id=""+o+"_action_"+t.id,c.className="action",l=document.createElement("a"),l.href=""+i+"/action/"+t.id,l.textContent="Action "+(a+1)+": ",u=document.createElement("strong"),u.textContent=t.name(),l.appendChild(u),(p=t.status({lowercase:!0}))&&(l.className="status-"+p,/^(?:started|tracked|paused)$/i.test(p)&&(d=document.createElement("button"),d.className="btn btn-round btn-warning icon-ok pull-right",d.name="finish",d.title="Force Finish",d.dataset.id=t.id,d.dataset.placement="left",$.data(d,"model",t),l.appendChild(d)),l.appendChild(r(p.toUpperCase(),"pull-right "+n[p]||""))),(null!=(m=t.content)?m.hasReport():void 0)&&s(l,t,"content","Report","icon-report","#content/{{id}}/report"),s(l,t,"content","Content","icon-page","#content/{{id}}"),s(l,t,"event","Event","icon-calendar","#event/{{id}}"),s(l,t,"tracking","Tracking","icon-calendar","#event/{{id}}"),h=document.createElement("span"),h.className="clearfix",l.appendChild(h),c.appendChild(l),e.appendChild(c)}),this.$detail.removeClass("link-condition").addClass("node-actions").append(e))},n.prototype._renderRefLink=function(t,e,n,i,r,o){var s,a,l,d,c;n=n.toLowerCase(),a=null!=(l=null!=(d=e.get(n))?d.id:void 0)?l:null!=(c=e.get(n+"_id"))?c.toString():void 0,null!=a&&(s=document.createElement("a"),s.className="ref-link pull-right "+r||"",s.textContent=i,s.href=o.replace("{{id}}",a),t.appendChild(s))},n.prototype._renderLink=function(t){var e,n,i,r;this.$detail.empty(),t&&(n=document.createDocumentFragment(),n.appendChild(this._renderHeaderItem(""+t._name+" "+(t.idx+1)+": "+t.name())),i=document.createElement("li"),e=document.createElement("a"),e.textContent="Condition",(r=t.status({lowercase:!0}))&&(e.className="status-"+r,e.appendChild(this._renderLabel(r.toUpperCase(),"pull-right "+this._cls[r]||""))),i.appendChild(e),n.appendChild(i),this.$detail.removeClass("node-actions").addClass("link-condition").append(n))},n}(C),x=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.auto=!1,n.prototype.urlRoot="worklfow",n.prototype.headerTitle="Create from Workflows",n.prototype.itemClassName="workflow-list-item",n.prototype.collection=L.workflows,n.prototype.defaultItem=null,n.prototype.events={click:function(t){var e;return e=t.target,"A"===e.tagName&&e.dataset.id?(t.preventDefault(),this.trigger("select",e.dataset.id,$(e).data("model")),!1):void 0}},n.prototype.render=function(){return this._clear(),this._render(),this._super_render(),this},n}(u),j=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.initialize=function(t){return n.__super__.initialize.call(this,t),this.urlRoot=this.column.get("urlRoot")||this.urlRoot,this.urlRoot&&"/"!==this.urlRoot.slice(-1)?this.urlRoot+="/":void 0},n.prototype.render=function(){var t;return this.$el.empty(),t=this.model.get("template_id"),t?L.find({workflowId:t,callback:function(e){return function(n){var i,r;return r=n.workflow,r?(i=_.escape(r.get("name")),e.$el.addClass("workflow-link-cell").append($("<a>",{tabIndex:-1,href:"#workflow/"+t}).attr("title",i).text(i)),e.delegateEvents()):(console.warn("failed to find workflow with id",t,e.model),e.$el.text("(Unknown)"))}}(this)}):(console.warn("workflow cell cannot find template_id for project",this.model),this.$el.text("(None)")),this},n}(Backgrid.UriCell),m=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.render=function(){return n.__super__.render.apply(this,arguments),/^STARTED$|^PAUSED$/.test(this.model.status())&&this._hide("remove"),this},n}(Backgrid.ActionsCell),g=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.columns=["checkbox","id","name:project","desc",{name:"template_id",label:"Workflow",editable:!1,cell:j},"status","updated_at",{name:"project",label:"",editable:!1,sortable:!1,cell:m}],n.prototype.collection=new y,n.prototype.defaultFilterField="name",n.prototype.initialize=function(t){var e;return n.__super__.initialize.call(this,t),this.list=new x({el:N("ul.workflow-list",this.el)}),this.listenTo(this.list,"select",function(t,e){return console.log("create project from workflow",t,e),this.trigger("create",t,e)}),this.on("remove",this.remove.bind(this)),e=y.projects.fullCollection,this.listenTo(e,"add",function(t){return function(e){t.collection.add(e),t.refresh()}}(this)),this.listenTo(this.collection,"remove",function(t){e.remove(t)}),this},n.prototype.remove=function(t){var e;return Array.isArray(t)||(t=[t]),t=t.filter(function(t){return!/^STARTED$|^PAUSED$/.test(t.status())}),t.length?(e=t.map(function(t){return t.get("name")}),confirm("Are you sure to remove these projects? \n"+e.join("\n")+"\n\nThis action cannot be undone!")&&t.forEach(function(t){return t.destroy()}),this):(alert("None of selected project can be removed.\nProjects already STARTED or PAUSED cannot be removed.\nIf you really want to remove them, STOP them first."),this)},n.prototype.render=function(){return this.list.fetch(),n.__super__.render.apply(this,arguments)},n}(c),w})}).call(this);