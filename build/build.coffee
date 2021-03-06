# build tool set

path = require 'path'
fs = require 'fs'
{exec} = require 'child_process'
zlib = require 'zlib'
async = require './async'

HEADER = 'demo - yyfearth.com/myyapps.com'

@async = async

@exists = exists = fs.exists or path.exists
@existsSync = existsSync = fs.existsSync or path.existsSync

@mkdir = mkdir = (dir, callback) ->
  # console.log 'mkdir', base, _rel
  dir = path.resolve dir
  exec "mkdir -p \"#{dir}\"", (err, stdout, stderr) ->
    callback stderr if stderr
    console.log err if err
    unless err
      callback? null
      return
    # fallback use sync
    mkdirSync dir
    callback? null
    throw 'err'
  return
# end of mkdir

@mkdirSync = mkdirSync = (dir) ->
  # console.log 'mkdir', base, _rel
  _rel = path.relative __dirname, dir
  return unless _rel
  _rel = _rel.split /[\\\/]/
  base = [__dirname]
  base.push _rel.shift() while _rel[0] is '..'
  base = path.resolve.apply null, base
  while (r = _rel.shift())
    base = path.join base, r
    fs.mkdirSync base unless existsSync base
  return
# end of mkdir sync

@rmdir = rmdir = (dir, callback) ->
  exists dir, (exists) ->
    unless exists
      callback?()
      return
    fs.stat dir, (err, stat) ->
      if err then callback err
      unless stat.isDirectory() then callback "Path <#{dir}> is not a directory"
      dir = path.resolve dir
      console.log 'clean:', dir
      exec "rm -rf \"#{dir}\"", (err, stdout, stderr) ->
        callback stderr if stderr
        unless err
          callback?()
          return
        rmdirSync dir # fallback
        callback?()
  return
# end of rmdir

@rmdirSync = rmdirSync = (dir) ->
  unless existsSync dir
    # console.log 'Directory <#{dir}> does not exist'
    return false
  
  stat = fs.statSync dir
  unless stat.isDirectory() then callback "Path <#{dir}> is not a directory"

  do act = (dir) ->
    names = fs.readdirSync dir

    for name in names
      filePath = path.join dir, name

      do (filePath) ->
        stat = fs.statSync filePath

        if stat.isFile()
          # console.log "Delete #{filePath}"
          fs.unlinkSync filePath
        else if stat.isDirectory()
          act filePath

    # console.log "Remove #{dir}"
    fs.rmdirSync dir
  return
# end of rmdir sync

@lsdir = lsdir = (dir, callback) -> # fake async
  async.nextTick -> callback lsdirSync dir
  return
# end of lsdir

@lsdirSync = lsdirSync = (dir) -> # sync only
  return null unless existsSync dir
  root = dir
  dir = '.'
  list = []
  do _lsdir = (dir) ->
    # console.log dir
    (fs.readdirSync path.join root, dir).forEach (filename) ->
      return if filename[0] is '.' # ignore hidden files
      filepath = path.join dir, filename
      stats = fs.statSync path.join root, filepath
      if stats.isDirectory()
        _lsdir filepath
      else
        list.push filepath
  list.root = root
  list
# end of lsdir sync

#@batch = batch = (files, func, callback) ->
  # files = [ {filename: '', mime: '', size: 0, data: Buffer} ]

readFileQ = async.queue (file, callback) ->
    fs.readFile file, callback
, 128

@read = read = (file, callback) ->
  readFileQ.push file, callback

@readdirgz = readdirgz = (list, callback) ->
  root = list.root
  async.map list, (filename, _callback) ->
    filepath = if root then path.join root, filename else filename
    read filepath, (err, data) ->
      if err
        _callback err
      else fs.stat filepath, (err, stats) ->
        mtime = stats.mtime.getTime() or 0
        size = stats.size or data.length
        gz = 0
        zlib.gzip data, (err, gz_data) ->
          if gz_data.length < data.length
            gz = 1
            data = gz_data
          _callback err, { filename, data, size, gz, mtime }
  , callback
  return
# end of read dir

@add_header = (filename, data, header = HEADER) ->
  ext = (path.extname filename)[1..].toLowerCase()
  switch ext
    when 'css', 'js'
      return "/*! #{header} */\n#{data}\n"
    when 'html'
      return "#{data}<!-- #{header} -->\n"
    else
      return data
# end of add header

@write = write = (filename, data, {encoding, callback} = {}) ->
  # console.log filename, data.length
  throw 'need filename and data' unless filename and data
  callback = cb if not callback? and typeof (cb = arguments[arguments.length - 1]) is 'function'
  # default encoding is urf-8
  if callback? # async (callback is not func means no callback)
    fs.writeFile filename, data, encoding, (err) ->
      callback? err
  else
    fs.writeFileSync filename, data, encoding
  return
# end of write

@load_pkg = (buf) ->
  head_len = 1
  pad_len = 16
  pad_char = 0
  head_len++ while buf[head_len]
  head = buf.toString 'utf-8', 1, head_len
  throw 'read package error: format padding mismatch' unless buf[0] is buf[buf.length - 1] is pad_char
  try
    head = JSON.parse head
  catch e
    throw 'cannot parse package'
  throw 'unacceptable package version ' + head.v unless head.v is 2
  offset = head_len + pad_len
  # test padding
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
# end of load package

mime_dict =
  js  : 'application/javascript;charset=utf-8'
  json: 'application/json;charset=utf-8'
  html: 'text/html;charset=utf-8'
  xml : 'text/xml;charset=utf-8'
  xsl : 'text/xml'
  xsd : 'text/xml'
  css : 'text/css'
  txt : 'text/plain'
  png : 'image/png'
  jpg : 'image/jpeg'
  gif : 'image/gif'
  ico : 'image/x-icon'
  bmp : 'image/x-ms-bmp'
  mp3 : 'audio/mpeg'
  ogg : 'audio/ogg'
  wav : 'audio/x-wav'
  appcache: 'text/cache-manifest'
  0: 'application/octet-stream' # default

mime_dict.jpeg = mime_dict.jpg
mime_dict.htm = mime_dict.html

# end of mime_dict

get_mime_name = (filename) ->
  ext = (path.extname filename)[1..].toLowerCase()
  if mime_dict.hasOwnProperty ext then ext else 0

get_mime = (filename) ->
  ext = path.extname filename
  mime_dict[ext[1..].toLowerCase()]

@build_pkg = build_pkg = (files, {filename, callback} = {}) ->
  if typeof files is 'string' # a dir path is given
    files = lsdirSync files
    readdirgz files, (err, files) ->
      if err
        throw err unless callback?
        callback err
      else
        build_pkg files, {filename, callback}
    return
  throw 'no files' unless files?[0]?.filename
  head = v: 2, ts: new Date().getTime(), files: {}
  buffer = null
  buf_size = 0
  pad_len = 16
  pad_char = 0

  if files.length > 16 # compact_count use compact format
    list = head.files = [[ # Header
      'filename'
      'mime'
      'gz'
      'size'
      'mtime'
      'offset'
      'length'
    ]]
    mimes = head.mimes = {}
    files.forEach (file) ->
      throw 'data should be a buffer' unless file.data and Buffer.isBuffer file.data
      len = file.data.length
      mime = file.mime or get_mime_name file.filename # 0 for not found
      mimes[mime] ?= mime_dict[mime]
      list.push [
        file.filename
        mime
        file.gz
        file.size # orginal size
        file.mtime
        buf_size
        len
      ]
      buf_size += pad_len + len
  else # files.length <= compact_count, use json format for small cache
    # files = [ {filename: '', mime: '', size: 0, data: Buffer} ]
    files.forEach (file) ->
      throw 'data should be a buffer' unless file.data and Buffer.isBuffer file.data
      
      len = file.data.length
      mime = file.mime or get_mime file.filename # 0 for not found

      # head.files[file.filename.toLowerCase()] = # case insensitive
      head.files[file.filename] = # case sensitive
        filename: file.filename
        mime: file.mime or get_mime file.filename
        gz: file.gz
        offset: buf_size
        length: len # gz length
        size: file.size # orginal size
        mtime: file.mtime
      
      buf_size += pad_len + len
  # end of if files.length > compact_count

  head_buf = new Buffer (JSON.stringify head), 'utf-8'
  head_len = head_buf.length
  buf_size += head_len + 2 # buffer_size already contain an extra pad_len
  buffer = new Buffer buf_size
  # fill buffer
  buffer.fill pad_char # fill pad_char to all
  cur_pos = 1
  # set head to the start (2rd char) of buffer
  head_buf.copy buffer, cur_pos
  cur_pos += head_len
  # set data to buffer with padding
  files.forEach (file) ->
    cur_pos += pad_len
    file.data.copy buffer, cur_pos
    cur_pos += file.data.length
    return
  # end of set buffer
  if filename
    if callback? # async (callback is not func means no callback)
      fs.writeFile filename, buffer, 'binary', (err) ->
        callback? err
    else
      fs.writeFileSync filename, buffer, 'binary'
  buffer # return
# end of build package
