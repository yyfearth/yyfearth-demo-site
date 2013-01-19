<?xml version="1.0" encoding="utf-8"?><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:template match="post"><div class="post" id="{@id}"><h2><xsl:choose><xsl:when test="/post"><xsl:value-of select="title"/></xsl:when><xsl:otherwise><a title="{title}" href="{@id}.xml"><xsl:value-of select="title"/></a></xsl:otherwise></xsl:choose></h2><div class="content"><p class="under"><span class="date"><xsl:value-of select="concat(datetime/@year,'-',datetime/@month,'-',datetime/@day,' ',datetime/@time)"/></span><span class="author"><xsl:value-of select="author"/></span><span class="category"><a href="category.xml?{category}" title="{category}"><xsl:value-of select="category"/></a></span><xsl:if test="tag"><span class="tags"><xsl:for-each select="tag"><xsl:if test="position()!=1">, </xsl:if><xsl:value-of select="."/></xsl:for-each></span></xsl:if></p><div class="summary"><xsl:copy-of select="summary/node()"/></div><xsl:if test="/post"><xsl:copy-of select="content/node()"/></xsl:if><xsl:if test="not(/post) and summary"><p style="margin-top:10px"><a class="post-link" href="{@id}.xml">阅读全文...</a></p></xsl:if><div class="fixed"></div></div></div></xsl:template></xsl:stylesheet>
