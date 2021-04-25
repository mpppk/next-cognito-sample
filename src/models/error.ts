export class BaseError extends Error {
  public errType = 'Base';
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

export type Primitive =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
export const isErr = (e: Primitive | object): e is BaseError => {
  switch (typeof e) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
    case 'undefined':
      return false;
    case 'object':
      if (e === null) return false;
      return 'errType' in e;
    default: {
      const _: never = e;
      return _;
    }
  }
};
