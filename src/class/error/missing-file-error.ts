import { CustomError } from 'ts-custom-error'

export class MissingFileError extends CustomError {
  file: string

  constructor(file) {
    super(`Cannot find ${file}`)

    this.file = file
  }
}
