build = require './build'

build_cache = (name) ->
  build.build_pkg "../#{name}/",
    filename: "./#{name}.cache"
    callback: (err) ->
      if err
        console.log name, err
      else
        console.log name, 'cached'

build.async.forEach [
  'baeword'
  'xmlcms'
  'menuwiz'
], build_cache
