<?xml version="1.0" encoding="utf-8"?><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:import href="frame.xsl"/><xsl:import href="post.xsl"/><xsl:variable name="upd" select="document(concat('../lastupdate.xml?',generate-id()))/post"/><xsl:template match="/day"><script type="text/javascript">document.title="最近更新 - XmlCMS"</script><xsl:choose><xsl:when test="$upd/@id"><xsl:variable name="day" select="$upd/@day"/><xsl:variable name="id" select="$upd/@id"/><xsl:variable name="xml" select="concat('../',$upd/@year,$upd/@month,'.xml')"/><xsl:variable name="latestxml" select="concat('../',$id,'.xml')"/><xsl:for-each select="document($xml)/descendant::post"><xsl:choose><xsl:when test="position()=1"><a href="{$id}.xml" style="z-index:0"><img style="position:relative;margin:0px 0px -30px -10px;" title="最近更新" alt="最近更新" src="theme/img/new.png"/></a><div style="position:relative;background-color:transparent;z-index:1"><xsl:apply-templates select="document($latestxml)/post"/></div><p><a class="post-link" href="{$id}.xml">完整信息...</a></p></xsl:when><xsl:when test="../@day=$day"><xsl:if test="position()=2"><div class="post"><h2>当日其他日志</h2></div></xsl:if><xsl:apply-templates select="."/><xsl:if test="position()=count(../post)"><div class="post"><h2>当月其他日志</h2></div></xsl:if></xsl:when><xsl:otherwise><div class="post" id="{@id}"><h2><a title="{title}" href="{@id}.xml"><xsl:value-of select="title"/></a></h2><div class="content"><p class="under"><span class="date"><xsl:value-of select="concat(datetime/@year,'-',datetime/@month,'-',datetime/@day,' ',datetime/@time)"/></span><span class="author"><xsl:value-of select="author"/></span><span class="category"><xsl:value-of select="category"/></span><xsl:if test="tag"><span class="tags"><xsl:for-each select="tag"><xsl:if test="position()!=1">, </xsl:if><xsl:value-of select="."/></xsl:for-each></span></xsl:if></p><div class="fixed"></div></div></div></xsl:otherwise></xsl:choose></xsl:for-each></xsl:when><xsl:otherwise><h1 style="text-align:center;margin-top:25px">没有创建日志！</h1></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="nav"><xsl:if test="$upd/@id"><li class="page_item"><a class="home" title="所有" href="calendar.xml">所有</a></li><li class="page_item"><a title="年" href="calendar.xml?{$upd/@year}"><xsl:value-of select="concat($upd/@year,'年')"/></a></li><li class="page_item"><a title="月" href="{$upd/@year}{$upd/@month}.xml"><xsl:value-of select="concat($upd/@month,'月')"/></a></li><li class="page_item"><a title="日" href="{$upd/@year}{$upd/@month}.xml?{$upd/@day}"><xsl:value-of select="concat($upd/@day,'日')"/></a></li><li class="current_page_item"><a href="#view" title="最近一天" onclick="return false"><xsl:value-of select="concat($upd/@time,'最近一天')"/></a></li></xsl:if></xsl:template></xsl:stylesheet>
