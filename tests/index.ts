import test from 'ava'
import { init, check, clean, upgrade, update, outdated } from '@/index'
import { join, relative } from 'path'
import fs from 'fs-extra'
import { TEMPLATE_STORAGE } from '@/consts'


test('Integration testing', async t => {
  await t.notThrowsAsync(async() => {
    const cwd = join(__dirname, '../demo')
    await fs.emptyDir(cwd)
    const repository = join(__dirname, './test-template')
    await init({ cwd, repository })

    const renameFile = join(cwd, 'new_file_name.md')
    if (!await fs.pathExists(renameFile)) throw new Error('rename.md is not existed')

    const keepFiles = join(cwd, 'keep/index.js')
    await fs.remove(keepFiles)

    const ignoreFile = join(cwd, '.npmignore')
    await fs.writeFile(ignoreFile, 't1\n', { flag: 'a' })

    await check({ cwd })

    await fs.remove(ignoreFile)

    await upgrade({ cwd })
    const deletedFile = join(cwd, 'deleted.md')

    if (await fs.pathExists(deletedFile)) throw new Error('The deleted file was existed.')

    await update({ cwd })
    await check({ cwd })

    await fs.remove(ignoreFile)

    await update({ cwd })
    await check({ cwd, showDiff: true, fold: true })
  })

  await t.throwsAsync(async() => {
    const cwd = join(__dirname, '../demo')
    await fs.emptyDir(cwd)
    const repository = relative(process.cwd(), join(__dirname, './test-template'))

    await init({ cwd, repository: `./${repository}` })
    await outdated({ cwd })
  })

  await t.throwsAsync(async() => {
    const cwd = join(__dirname, '../demo')
    await fs.emptyDir(cwd)
    const repository = relative(process.cwd(), join(__dirname, './test-template'))

    await init({ cwd, repository: `./${repository}` })
    await outdated({ cwd })
  })

  await t.throwsAsync(async() => {
    const cwd = join(__dirname, '../demo')
    await fs.emptyDir(cwd)
    const repository = relative(process.cwd(), join(__dirname, './test-template'))

    await init({ cwd, repository: `./${repository}`, version: 'abc' })
  })

  await t.notThrowsAsync(async() => {
    const cwd = join(__dirname, '../demo')
    await fs.emptyDir(cwd)
    const repository = relative(process.cwd(), join(__dirname, './test-template'))

    await init({ cwd, repository: `./${repository}` })

    await clean()
    if (await fs.pathExists(TEMPLATE_STORAGE)) throw new Error("mili.clean wasn't remove tempalte cache")
  })
})
