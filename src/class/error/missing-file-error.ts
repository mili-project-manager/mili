import { CustomError } from 'ts-custom-error'

export class MissingFileError extends CustomError {
  public file: string

  constructor(file) {
    super(`Cannot find ${file}`)

    this.file = file
  }
}