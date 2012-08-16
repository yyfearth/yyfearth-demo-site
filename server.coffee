# server.coffee

PORT = 8080

CACHE =
  base: 'cache'
  packages: [
    root: '/'
    package: 'index.cache'
  ,
    root: '/menuwiz/'
    package: 'menuwiz.cache'
  ,
    root: '/baeword/'
    package: 'baeword.cache'
    lazyload: on
  ,
    root: '/xmlcms/'
    package: 'xmlcms.cache'
    lazyload: on
  ,
    root: '/nav-sidebar/'
    package: 'nav-sidebar.cache'
    lazyload: on
  ]

#CACHE = packages: [{ root: '/', package: 'root.cache' }]

fs = require 'fs'
path = require 'path'
http = require 'http'
url = require 'url'

class FileServer

  @create: (ip, port) -> new @ ip, port

  constructor: (@ip, @port = PORT) ->
    @svr = http.createServer @routing.bind @
    # load static files
    @load =>
      @svr.listen @port, @ip
      console.log "server listening on port #{@port} ..."
      return
  # end of constructor

  _load_caches: (callback) -> # run once
    _cache = @cache = {}
    _count = CACHE.packages.length
    _callback = (err) ->
      if err
        console.log 'err', err
        callback err
      else unless --_count
        callback null, _cache
      return
    CACHE.packages.forEach (cache) =>
      _pkg = path.join __dirname, CACHE.base, cache.package
      # ignored lazyload for now
      fs.readFile _pkg, 'binary', (err, data) =>
        return _callback err if err

        _files = @_load_cache new Buffer data, 'binary'

        for filename in Object.getOwnPropertyNames _files
          _path = cache.root + filename
          _file = _cache[_path] = _files[filename]
          _file.path = _path
          _file.filename = path.basename _path

        console.log 'cache', cache.package, 'loaded'
        _callback null
        return
      # end of read file
    return

  _load_cache: (buf) ->
    head_len = 0
    pad_len = 16
    pad_char = 0
    head_len++ while buf[head_len]
    head = buf.toString 'utf-8', 0, head_len
    try
      head = JSON.parse head
    catch e
      throw 'cannot parse package'
    throw 'unacceptable package version ' + head.v unless head.v is 2
    offset = head_len + pad_len
    throw 'read package error: head padding mismatch' if buf[offset - 1] isnt pad_char
    # load content
    _get_data = (file) ->
      file.offset += offset
      end = file.offset + file.length
      throw 'read package error: padding mismatch' if buf[end] isnt pad_char
      file.data = buf.slice file.offset, end
      delete file.offset
      return
    if Array.isArray head.files # is compact format
      headers = head.files.shift()
      files = {}
      head.files.forEach (f) ->
        file = {}
        file[n] = f[i] for n, i in headers
        file.mime = head.mimes[file.mime]
        _get_data file
        files[file.filename] = file
    else # is json fast format
      files = head.files
      _get_data files[name] for name in Object.getOwnPropertyNames files
    # end of if is array
    files
  # end of load cache package

  load: (callback) ->
    @_load_caches (err, cache) =>
      throw err if err
      console.log 'init cache loaded'
      callback()
      return
    return
  # end of load

  cmd: (cmd, req, res) ->
    res.setHeader 'Cache-Control', 'no-cache'
    console.log 'cmd', cmd
    switch cmd
      when ''
        res.writeHead 403, 'Forbidden'
        res.end "403 forbidden"
      when 'reload'
        @load ->
          console.log 'reloaded'
          res.end 'reloaded'
      else
        res.writeHead 501, 'Not Implemented'
        res.end "501 cmd '#{cmd}' not implemented"
    return

  routing: (req, res) ->
    return unless @chkUA req, res

    return unless @_chk_gz req, res

    # console.log 'routing', req.url
    _url = url.parse req.url
    _file = _url.pathname

    if _file[0..2] is '/-/' # admin cmds
      cmd = _file[3..]
      @cmd cmd, req, res
      return
    
    # add ending / for 1st level dir
    if /^\/[\w\-]+$/.test _file
      res.writeHead 301, 'Location': _file + '/'
      res.end()
      return
    # TODO: deal with sub dir without ending /
    # looking for index.html in cache

    _file += 'index.html' if _file[-1..] is '/' # index page

    # cached files
    if @cache[_file]
      # static files
      # console.log 'routing file', req.url, file
      @serve { url: _url.href, file: _file, caching: on, req, res }
    else
      res.writeHead 404, 'Not Found'
      res.end '404 resource not found'
    
    return
  # end of routing

  chkUA: (req, res) ->
    ua = req.headers['user-agent']
    if /MSIE [1-9]\./i.test ua
      msg = 'This WebApp does not support IE below 10!'
    else if /opera/i.test ua
      msg = 'This WebApp does not support Opera!'
    else if /^Mozilla\/4/i.test ua
      msg = 'This WebApp does not support your browser! \nIt seems your browser is out of date.'
    else
      return true
    # res.writeHead 200, 'Content-Type': 'text/plain'
    res.end msg
    return false
  # end of check ua

  MAX_AGE: 30 * 24 * 60 * 60 * 1000 # 30 days
  MIN_AGE: 60 * 1000 # 1 min

  _chk_gz: (req, res) ->
    unless /\bgzip\b/.test req.headers['accept-encoding']
      console.log 'gzip unsupported for the client'
      res.writeHead 406, 'Not Acceptable'
      res.end 'the client does not support gziped content (accept-encoding header).'
      false
    true
  # end of check gz support
  _chk_mod: (url, file, req, res) ->
    _lastmod = req.headers['if-modified-since']
    _etag = req.headers['if-none-match']
    if _lastmod and _etag and _etag is file._etag and file._mtime is new Date(_lastmod).getTime()
      console.log 'serve file not modified', url
      res.writeHead 304, 'Not Modified'
      res.end()
      false
    true
  # end of check if modified
  serve: ({url, file, caching, req, res}) ->
    # console.log req.headers

    unless _file = @cache[file]
      throw 'failed to find the file ' + file

    _file._mtime = new Date _file.mtime

    return unless @_chk_mod url, _file, req, res

    console.log 'serve file:', file, 'caching:', caching

    _expires = if caching then _file.mtime + @MAX_AGE else new Date().getTime() + @MIN_AGE
    _caching = if caching then @MAX_AGE else @MIN_AGE

    # for IE6 do not use 'Cache-Control: no-cache'
    res.setHeader 'Content-Type', _file.mime
    res.setHeader 'Content-Encoding', 'gzip' if _file.gz
    res.setHeader 'Vary', 'Accept-Encoding'
    res.setHeader 'Content-Length', _file.data.length
    res.setHeader 'Last-Modified', _file._mtime.toUTCString()
    res.setHeader 'Date', new Date().toUTCString()
    res.setHeader 'Expires', new Date(_expires).toUTCString()
    res.setHeader 'Cache-Control', 'public, max-age=' + (_caching / 1000) | 0
    res.setHeader 'ETag', _file._etag = "\"#{_file.size}-#{_file.mtime}\""
    res.end _file.data, 'binary'

    return
  # end of serve file

svr = FileServer.create()
