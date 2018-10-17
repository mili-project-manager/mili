const merge = require('merge-deep');
const fs = require('fs')



console.log(merge({ a: { b: { c: 'c' } } }, { a: { b: { c: 'd', d: 'e'}}}))
