import test from 'ava'
import isChildPathOf from '../../src/utils/is-child-path-of'

test('check path /a/b/c is the child of path /a/b/c/d', t => {
  t.true(isChildPathOf('/a/b/c')('/a/b/c/d'))
  t.true(isChildPathOf('./a/b/c')('./a/b/c/d'))
})

test('check path ./a/b/c is the child of path ./a/b/c/d', t => {
  t.true(isChildPathOf('./a/b/c')('./a/b/c/d'))
})

test('the path /a/b/c is not the child of path /a/b/c', t => {
  t.false(isChildPathOf('/a/b/c')('/a/b/c'))
})

test('the path /a/b/c is not the child of path /a/b', t => {
  t.false(isChildPathOf('/a/b/c')('/a/b'))
})

test('the path ./a/b/c is not the child of path ./c/d', t => {
  t.false(isChildPathOf('./a/b/c')('./c/d'))
})
