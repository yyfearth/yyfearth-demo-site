# Requirements & definition
# fs = require 'fs'
path = require 'path'
# util = require 'util'
build = require './build/build'
# async = build.async

build_cache = (name) ->
  p = path.join __dirname, name
  build.build_pkg p,
    filename: p + '.cache'
    callback: (err) ->
      if err
        console.log name, err
      else
        console.log name, 'cached'

task 'build', 'Build caches to root', ->
  [
    'baeword'
    'xmlcms'
    'menuwiz'
    'nav-sidebar'
    'index'
  ].forEach build_cache

task 'build:baeword', 'Build baeword.cache to root', ->
  build_cache 'baeword'

task 'build:xmlcms', 'Build xmlcms.cache to root', ->
  build_cache 'xmlcms'

task 'build:menuwiz', 'Build menuwiz.cache to root', ->
  build_cache 'menuwiz'

task 'build:sidebar', 'Build sidebar.cache to root', ->
  build_cache 'sidebar'

task 'build:index', 'Build index.cache to root', ->
  build_cache 'index'

# task 'test', 'Run all test cases', ->
