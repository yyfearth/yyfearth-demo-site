# server.coffee

# require('nodetime').profile
#   accountKey: 'fb559519c42432efc320a5c7dfcf0135ab880eed'
#   appName: 'yyfearth-demo-site'

IP = null
PORT = 8080

CACHE =
  base: 'cache'
  packages: [
    root: '/'
    package: 'index.cache'
  ,
    root: '/marxo/'
    package: 'marxo.cache'
    lazyload: on
  ,
    root: '/menuwiz/'
    package: 'menuwiz.cache'
    lazyload: on
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
  ,
    root: '/driver-asst/'
    package: 'driver-asst.cache'
    lazyload: on
  ]

#CACHE = packages: [{ root: '/', package: 'root.cache' }]

fs = require 'fs'
path = require 'path'
http = require 'http'
url = require 'url'
zlib = require 'zlib'

class FileServer

  @create: (ip, port) -> new @ ip, port

  constructor: (@ip = IP, @port = PORT) ->
    @svr = http.createServer @routing.bind @
    # load static files
    @load =>
      @svr.listen @port, @ip
      console.log "server listening on port #{@port} ..."
      return
  # end of constructor

  _load_caches: (lazy = true, callback) -> # run once
    _cache = @cache = _lazyload: {}
    _count = CACHE.packages.length
    _lazy = _cache._lazyload
    CACHE.packages.forEach (cache) =>
      throw new Error 'cache must have root' unless cache.root
      if lazy and cache.lazyload and cache.root isnt '/'
        _cache[cache.root[0...-1]] = "301:#{cache.root}"
        _lazy[cache.root] = cache
        --_count
      else @_load_cache_pkg cache, (err) ->
        if err
          console.log 'err', err
          callback err
        else unless --_count
          callback null, _cache
        return
      return
    _cache._lazy_regex = new RegExp '^' + Object.keys(_lazy).join '|^'
    # console.log 'regex', _cache._lazy_regex
    return

  _lazyload: (path, req, res) ->
    _cache = @cache
    _lazy = _cache._lazyload
    _root = _cache._lazy_regex and path.match(_cache._lazy_regex)?[0]
    if _root
      cache = _lazy[_root]
      console.log 'lazyload cache', cache.package, 'for', _root
      # remove loaded and regen regex
      delete _lazy[_root]
      _keys = Object.keys(_lazy)
      if _keys.length
        _cache._lazy_regex = new RegExp '^' + _keys.join '|^'
      else
        @_lazyload = @_not_found.bind @
        delete _cache._lazy_regex
      # start to load
      @_load_cache_pkg cache, (err) =>
        if err
          console.log 'err', err
          res.writeHead 500, 'Internal Server Error'
          res.end '500 internal server error: faild to load package file'
        else
          @routing req, res
        return
    else @_not_found path, req, res
    return

  _load_cache_pkg: (cache, callback) ->
    _cache = @cache
    _pkg = path.join __dirname, CACHE.base, cache.package

    fs.readFile _pkg, 'binary', (err, data) =>
      return callback err if err

      _files = @_load_cache new Buffer data, 'binary'

      for filename in Object.getOwnPropertyNames _files
        _path = cache.root + filename
        _file = _cache[_path] = _files[filename]
        _file.path = _path
        _filename = _file.filename = path.basename _path
        if /^index\.html?$/i.test _filename
          _dirname = path.dirname _path
          if _dirname is '/'
            _cache['/'] = "/#{_filename}"
          else
            _cache[_dirname] = "301:#{_dirname}/"
            _cache[_dirname + '/'] = "#{_dirname}/#{_filename}"

      console.log 'cache', cache.package, 'loaded'
      gc?()
      callback null
      return
    # end of read file
    return

  _load_cache: (buf) ->
    head_len = 1
    pad_len = 16
    pad_char = 0
    head_len++ while buf[head_len]
    head = buf.toString 'utf-8', 1, head_len
    throw new Error 'read package error: format padding mismatch' unless buf[0] is buf[buf.length - 1] is pad_char
    try
      head = JSON.parse head
    catch
      throw new Error 'cannot parse package'
    throw new Error 'unacceptable package version ' + head.v unless head.v is 2
    offset = head_len + pad_len
    # test padding
    throw new Error 'read package error: head padding mismatch' if buf[offset - 1] isnt pad_char
    # load content
    _get_data = (file) ->
      file.offset += offset
      end = file.offset + file.length
      throw new Error 'read package error: padding mismatch' if buf[end] isnt pad_char
      file.data = buf.slice file.offset, end
      delete file.offset
      return
    if Array.isArray head.files # is compact format
      headers = head.files.shift()
      files = {}
      head.files.forEach (f) ->
        file = {}
        # read from array
        file[n] = f[i] for n, i in headers
        # get mime
        file.mime = head.mimes[file.mime]
        # calc offset and get data
        _get_data file
        # set to files
        files[file.filename] = file # case sensitive
        # files[file.filename.toLowerCase()] = file # case insensitive
    else # is json fast format
      files = head.files
      _get_data files[name] for name in Object.getOwnPropertyNames files
    # end of if is array
    files
  # end of load cache package

  _not_found: (path, req, res = req) ->
    console.log '404 not found', path
    res.writeHead 404, 'Not Found'
    res.end '404 resource not found'
    return

  load: (callback, full) ->
    @_load_caches not full, (err, cache) =>
      throw new Error err if err
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
      when 'full-reload'
        @load ->
          console.log 'full reloaded'
          res.end 'full reloaded'
        , true
      when 'full-load'
        _count = 0
        for own ignored, cache of @cache._lazyload
          ++_count
          @_load_cache_pkg cache, (err) =>
            if err
              console.log 'err', err
              res.end 'faild to load package file'
              _count = 0
            else unless --_count
              console.log 'all loaded'
              res.end 'all loaded'
            return
      else
        res.writeHead 501, 'Not Implemented'
        res.end "501 cmd '#{cmd}' not implemented"
    return

  routing: (req, res) ->
    # return unless @chkUA req, res

    # console.log 'routing', req.url
    _url = url.parse req.url
    _file = _url.pathname

    if _file[0..2] is '/-/' # admin cmds
      cmd = _file[3..]
      @cmd cmd, req, res
      return

    # cached files or links
    _cached = @cache[_file]
    # solve link to file
    while typeof _cached is 'string'
      if /^30[1237]:/.test _cached # redirect
        _code = _cached[0...3]
        _cached = _cached[4..]
        console.log 'redirect', _code, _file, '->', _cached
        res.writeHead _code, 'Location': _cached
        res.end()
        return
      else # rewrite
        console.log 'rewrite', _file, '->', _cached
        _cached = @cache[_file = _cached]
    # link solved
    unless _cached # not found
      @_lazyload _file, req, res
    else # static files
      # console.log 'routing file', req.url, file
      @serve { url: _url.href, file: _file, caching: on, req, res }

    return
  # end of routing

  # chkUA: (req, res) ->
  #   ua = req.headers['user-agent']
  #   if /MSIE [1-9]\./i.test ua
  #     msg = 'This WebApp does not support IE below 10!'
  #   else if /opera/i.test ua
  #     msg = 'This WebApp does not support Opera!'
  #   else if /^Mozilla\/4/i.test ua
  #     msg = 'This WebApp does not support your browser! \nIt seems your browser is out of date.'
  #   else
  #     return true
  #   # res.writeHead 200, 'Content-Type': 'text/plain'
  #   res.end msg
  #   return false
  # end of check ua

  MAX_AGE: 30 * 24 * 60 * 60 * 1000 # 30 days
  MIN_AGE: 60 * 1000 # 1 min

  _chk_mod: (url, file, req, res) ->
    _lastmod = req.headers['if-modified-since']
    _etag = req.headers['if-none-match']
    if _lastmod and _etag and _etag is file._etag and file.mtime is new Date(_lastmod).getTime()
      console.log '304 served file not modified', url
      res.writeHead 304, 'Not Modified'
      res.end()
      false
    else true
  # end of check if modified
  serve: ({url, file, caching, req, res}) ->
    # console.log req.headers
    console.log 'req:', req.connection.remoteAddress, req.url

    unless _file = @cache[file]
      throw new Error 'failed to find the file ' + file

    _file._mtime ?= new Date _file.mtime
    _file._etag ?= "\"#{_file.size}-#{_file.mtime}\""

    return unless @_chk_mod url, _file, req, res

    # check gzip and serve file data
    caching = false if _file.caching is false
    _accept_gz = /\bgzip\b/.test req.headers['accept-encoding']
    if _file.gz and not _accept_gz
      console.log 'gzip unsupported for the client'
      if _file._data?
        @_serve_data res, _file, caching, _accept_gz, _file._data
      else zlib.gunzip _file.data, (err, _data) =>
        if err
          console.log 'unzip failed', _file.filename
          res.writeHead 406, 'Not Acceptable'
          res.end 'unzip failed, and the client does not support gziped content (accept-encoding header).'
        else
          _file._data = _data
          @_serve_data res, _file, caching, _accept_gz, _file._data
        return
      # end of gunzip and if has _data
    else
      @_serve_data res, _file, caching, _accept_gz, _file.data
    # end of if gz and accept gz
    return
  # end of serve file
  _serve_data: (res, file, caching, accept_gz, data) ->
    console.log '200 serve file:', file.filename # , 'caching:', caching

    _expires = if caching then file.mtime + @MAX_AGE else new Date().getTime() + @MIN_AGE
    _caching = if caching then @MAX_AGE else @MIN_AGE

    # for IE6 do not use 'Cache-Control: no-cache'
    res.setHeader 'Content-Type', file.mime
    res.setHeader 'Vary', 'Accept-Encoding'
    res.setHeader 'Last-Modified', file._mtime.toUTCString()
    res.setHeader 'Expires', new Date(_expires).toUTCString()
    res.setHeader 'Cache-Control', 'public, max-age=' + ((_caching / 1000) | 0)
    res.setHeader 'ETag', file._etag
    # res.setHeader 'Date', new Date().toUTCString() # auto
    res.setHeader 'Content-Encoding', 'gzip' if accept_gz and file.gz
    res.setHeader 'Content-Length', data.length
    res.end data, 'binary'

    return
  # end of serve file data

svr = FileServer.create()
