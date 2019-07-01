import fs from 'fs-extra'
import { relative, join } from 'path'
import { Handler, Resource, CompiledFile } from '@/internal'
import { InferEncodingFunc } from '@/consts'
import { inferEncodingNormally } from '@/infer-encoding'


export class File {
  public templatePath: string

  public inferEncoding: InferEncodingFunc

  public handler?: Handler

  constructor(path: string, inferEncoding: InferEncodingFunc = inferEncodingNormally, handler?: Handler) {
    this.templatePath = path
    this.inferEncoding = inferEncoding
    this.handler = handler
  }

  public async compile(resource: Resource): Promise<CompiledFile> {
    await this.readTemplateFile()
    const { templatePath } = this

    let projectPath = templatePath
    projectPath = relative(resource.template.path, this.templatePath)
    projectPath = join(resource.project.path, projectPath)

    if (this.handler) {
      projectPath = await this.handler.genPath(projectPath, resource)
    }

    const content = await this.readTemplateFile()
    const encoding = this.inferEncoding(this.templatePath)

    const projectFileExisted = await fs.pathExists(projectPath)

    const compiledFile = new CompiledFile(templatePath, content, encoding, projectPath, resource, projectFileExisted)

    if (this.handler) await this.handler.genFile(compiledFile, resource)

    return compiledFile
  }

  private async readTemplateFile(): Promise<string> {
    const { templatePath, inferEncoding } = this
    const encoding = inferEncoding(templatePath)
    return await fs.readFile(templatePath, encoding)
  }
}

export type Files = File[]
