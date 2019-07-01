
export enum Encoding {
  UTF8 = 'utf8',
  Binary = 'binary',
  Hex = 'hex',
  ASCII = 'ascii',
}

export type InferEncodingFunc = (path: string) => Encoding
