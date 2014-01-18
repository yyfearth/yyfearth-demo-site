# Requirements & definition
fs = require 'fs'
path = require 'path'
# util = require 'util'
# {exec} = require 'child_process'
build = require './build/build'
# async = build.async

build_cache = (name) ->
  cache_dir = if name is 'root' then __dirname else path.join __dirname, 'cache'
  dir = path.join __dirname, name
  fs.mkdir cache_dir, -> build.build_pkg dir,
    filename: (path.join cache_dir, name + '.cache')
    callback: (err) ->
      if err
        console.log name, err
      else
        console.log name, 'cached'

pkgs = [
  'marxo'
  'baeword'
  'xmlcms'
  'menuwiz'
  'nav-sidebar'
  'driver-asst'
  'index'
]

task 'build', 'Build caches to cache', ->
  pkgs.forEach build_cache

pkgs.forEach (pkg) ->
  task 'build:' + pkg, "Build #{pkg}.cache to cache", ->
    build_cache pkg

task 'build:one', 'Build root.cache to root', ->
  build_cache 'root'

# task 'test', 'Run all test cases', ->
