const { curry, append , remove, map, prop, compose, replace } = require('ramda')
const Task = require('data.task')
const daggy = require('daggy')
const { fold } = require('pointfree-fantasy')
const { Some, None } = require('fantasy-options')
const { indexOf, Http } = require('./utils')

//mayToOpt:: Maybe a -> Option a
const mayToOpt = (m) => m.cata({Just: Some, Nothing: () => None})

//Photo { src :: Url, x :: Point, y :: Point }
const Photo = daggy.tagged('src', 'x', 'y')

//newPhoto :: Url -> Photo
const newPhoto = (url) => Photo(url, 0, 0)

// This isn't needed. We're simply adding the ability to call Url instead of String
const Url = String

const baseUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1c69bfb4d69479c3e3724541738c3e53&tags={TAGS}&extras=url_s&format=json&jsoncallback=?'


//makeUrl :: String -> Url 
const makeUrl = (t) => replace("{TAGS}", t, baseUrl)

//toPhoto
const toPhoto = compose(map(compose(newPhoto, prop('url_s'))), prop('photo'), prop('photos'))

//flickrSearch :: String -> Task Error [Url]
const flickrSearch = compose(map(toPhoto), Http.get, makeUrl)

//replacePhoto :: Photo -> [Photo] -> [ Photo]
const replacePhoto = curry( (p, ps) => compose(fold(append(p), () => append(p, ps)),
											 mayToOpt,
											 map(i => remove(i, 1, ps)), 
											 indexOfPhoto(p))(ps) )

//indexofPhoto :: Photo -> [Photo] -> Maybe
const indexOfPhoto = curry((p, ps) =>  indexOf(p.src, ps.map(prop('src'))) )

module.exports = { flickrSearch, Photo, replacePhoto }