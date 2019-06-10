import test from 'ava'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

test('exec command in hook', async t => {
  const command = "echo '123'"
  const exec = sinon.stub().callsFake((str, fn) => {
    t.true(str === command)
    t.true(exec.calledWith(str, fn))
    t.true(exec.calledOnce)
    fn(null, '', '')
  })

  const formatHooks = proxyquire(
    '../../../src/load-config/load-template-config/format-hooks',
    { child_process: { exec } },
  )

  await formatHooks({ afterInit: command })('afterInit')
})

test('exec error command in hooks', async t => {
  const command = "echo '123'"
  const exec = sinon.stub().callsFake((str, fn) => {
    t.true(str === command)
    t.true(exec.calledWith(str, fn))
    t.true(exec.calledOnce)
    fn(new Error('error'), '', '')
  })

  const formatHooks = proxyquire(
    '../../../src/load-config/load-template-config/format-hooks',
    { child_process: { exec } },
  )

  await t.notThrowsAsync(formatHooks({ afterInit: command })('afterInit'))
})

test('exec function in hook', async t => {
  const func = sinon.stub().resolves()

  const formatHooks = proxyquire(
    '../../../src/load-config/load-template-config/format-hooks',
    {},
  )

  await formatHooks({ afterInit: func })('afterInit')
  t.true(func.calledOnce)

  const errorFunc = sinon.stub().throws()
  await t.notThrowsAsync(formatHooks({ afterInit: errorFunc })('afterInit'))
})
