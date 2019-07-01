import test from 'ava'
import { Question } from '@/internal'

test('Default question', t => {
  const question = new Question({ name: 'key' })

  t.is(question.type, 'input')
  t.true(question.answered({ key: '123' }))
  t.false(question.answered({ a: '123' }))
})

test('List question', t => {
  const question = new Question({ type: 'list', name: 'key', choices: ['123', '456'] })

  t.is(question.type, 'list')
  t.true(question.answered({ key: '123' }))
  t.false(question.answered({ a: '123' }))
})

test('Number question', t => {
  const question = new Question({ type: 'number', name: 'key' })

  t.is(question.type, 'number')
  t.true(question.answered({ key: 123 }))
  t.false(question.answered({ key: '123' }))
})

test('Confirm question', t => {
  const question = new Question({ type: 'confirm', name: 'key' })

  t.is(question.type, 'confirm')
  t.true(question.answered({ key: true }))
  t.false(question.answered({ key: '123' }))
  t.false(question.answered({ a: '123' }))
})

test('Checkbox question', t => {
  const question = new Question({ type: 'checkbox', name: 'key', choices: () => ['123', '456', '789'] })

  t.is(question.type, 'checkbox')
  t.true(question.answered({ key: ['123', '456'] }))
  t.false(question.answered({ key: ['123', '678'] }))
})
