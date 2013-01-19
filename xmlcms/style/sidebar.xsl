<?xml version="1.0" encoding="utf-8"?><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:variable name="cal" select="document('../calendar.xml')"/><xsl:template match="/"><xsl:if test="not(err|msg)"><div id="sidebar" class="sidebar"><script type="text/javascript"><![CDATA[if(/msie [0-5]\.|firefox\/[0-2]|mozilla\/[0-3]|opera\/[0-7]/i.test(navigator.userAgent))document.writeln('<div id="browserwarnning"><a href="browsers.html">\u60a8\u6240\u4f7f\u7528\u7684\u6d4f\u89c8\u5668\u7248\u672c\u8fc7\u4f4e\uff0c\u53ef\u80fd\u65e0\u6cd5\u6b63\u5e38\u7684\u6d4f\u89c8\u672c\u9875\u9762\uff01\u5982\u679c\u60f3\u8981\u6d4f\u89c8\u5b8c\u6574\u7684\u6548\u679c\uff0c\u8bf7\u66f4\u65b0\u6216\u66f4\u6362\u6d4f\u89c8\u5668\u3002</a></div>');else if(/msie 6/i.test(navigator.userAgent))document.writeln('<div id="ie6notify"><a href="browsers.html">\u60a8\u6240\u4f7f\u7528\u7684 Microsoft Internet Explorer 6.0 \u6d4f\u89c8\u5668\uff0c\u65e0\u6cd5\u6b63\u786e\u7684\u5904\u7406\u672c\u9875\u9762\u4e2d\u67d0\u4e9b\u7ec6\u8282\uff0c\u4e3a\u4e86\u66f4\u597d\u7684\u6d4f\u89c8\u4f53\u9a8c\uff0c\u66f4\u4e3a\u4e86\u4e92\u8054\u7f51\u5e94\u7528\u7684\u7f8e\u597d\u660e\u5929\uff0c\u5f3a\u70c8\u63a8\u8350\u60a8\u5347\u7ea7\u60a8\u7684\u6d4f\u89c8\u5668\uff01</a></div>')]]></script><noscript><div id="browserwarnning">您的浏览器禁用了或不支持Javascript脚本支持，将无法正常的浏览本页面！如果想要浏览完整的效果，请开启Javascript脚本支持或更换浏览器。</div></noscript><div class="widget"><div class="title">迷你日历</div><div id="minical"></div><xsl:variable name="datecal"><xsl:for-each select="$cal//month"><xsl:sort select="concat(../@year,@month)" data-type="number"/><xsl:value-of select="concat(../@year,@month,':{')"/><xsl:for-each select="day"><xsl:value-of select="@day"/>:<xsl:value-of select="count(./post)"/><xsl:if test="not(position()=last())">,</xsl:if></xsl:for-each><xsl:text>}</xsl:text><xsl:if test="not(position()=last())">,</xsl:if></xsl:for-each></xsl:variable><xsl:variable name="curmonth"><xsl:choose><xsl:when test="/month"><xsl:value-of select="concat(//@year,//@month)"/></xsl:when><xsl:when test="/post/datetime"><xsl:value-of select="concat(//datetime/@year,//datetime/@month)"/></xsl:when><xsl:otherwise>0</xsl:otherwise></xsl:choose></xsl:variable><script type="text/javascript">var curmonth =<xsl:value-of select="$curmonth"/>,datecal = {<xsl:value-of select="$datecal"/>};<![CDATA[function prevmonth(){var _=Math.floor(curmonth/100),$=curmonth%100-1;if($==0){_--;$=12}curmonth=_*100+$;return showcal(curmonth)}function nextmonth(){var _=Math.floor(curmonth/100),$=curmonth%100+1;if($==13){_++;$=1}curmonth=_*100+$;return showcal(curmonth)}function showcal(B){var _=new Date(),A=_.toDateString();if(!B)B=_.getFullYear()*100+_.getMonth()+1;var F=Math.floor(B/100),C=B%100;curmonth=F*100+C;var E='<table><caption><a href="#" title="\u4e0a\u6708" onclick="return prevmonth()">&lt;</a> '+((B in datecal)?'<a href="'+B+'.xml">'+F+"\u5e74"+C+"\u6708</a>":F+"\u5e74"+C+"\u6708")+'<a href="#" title="\u4e0b\u6708" onclick="return nextmonth()">&gt;</a></caption>'+"<tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr>\n<tr>",D=new Date(F,C-1,1);if(D.getDay())E+='<td colspan="'+D.getDay()+'"></td>';for(var $=1;$<=new Date(F,C,0).getDate();$++){D=new Date(F,C-1,$);if(D.getDay()==0)E+="</tr><tr>";E+="<td "+((A==D.toDateString())?'class="today" title="\u4eca\u5929"':"")+">"+((B in datecal&&$ in datecal[B])?'<a href="'+B+".xml?"+$+'" title="'+$+" \u65e5 \u6709 "+datecal[B][$]+' \u7bc7\u65e5\u5fd7"> '+$+"</a>":$)+"</td>"}E+="</tr></table>";document.getElementById("minical").innerHTML=E;return false}showcal(curmonth)]]></script><noscript>Javascript脚本无法运行！</noscript><div class="fixed"></div></div><div class="widget"><div class="title">最近更新</div><ul><xsl:for-each select="$cal/descendant::post[position()&lt;6]"><li><a href="{@id}.xml" title="『{title}』于{datetime/@year}-{datetime/@month}-{datetime/@day} {datetime/@time}发表"><xsl:value-of select="title"/></a></li></xsl:for-each></ul><div class="fixed"></div></div><div class="widget"><div class="title">日志分类</div><div id="minicats"><xsl:variable name="cats"><xsl:for-each select="$cal/descendant::post/category"><xsl:sort select="text()" order="descending"/><xsl:text>'</xsl:text><xsl:value-of select="."/><xsl:text>',</xsl:text></xsl:for-each><xsl:text>null</xsl:text></xsl:variable><script type="text/javascript">var cats = [<xsl:value-of select="$cats"/>];<![CDATA[var hcats="<ul>";for(var i=0;i<cats.length-1;i++)if(cats[i]!=cats[i+1])hcats+='<li><a href="category.xml?'+cats[i]+'">'+cats[i]+"</a></li>";hcats+="</ul>";document.getElementById("minicats").innerHTML=hcats]]></script><noscript>Javascript脚本无法运行！</noscript></div><div class="fixed"></div></div><div class="widget"><div class="title" style="text-align:center"><a href="mgr.xml">后台管理</a></div><div class="fixed"></div></div><div id="tongji" style="margin:10px;text-align:center"><a href="http://tongji.alimama.com/report.html?unit_id=656009"><img src="http://img.tongji.linezing.com/656009/tongji.gif"/></a></div></div></xsl:if></xsl:template></xsl:stylesheet>
