/**
 * @returns Whether the provided parameter is not undefined or null.
 */
 export function isDefined<T>(value: T | undefined | null): value is T {
    return !isUndefinedOrNull(value);
  }
  
  /**
   * @returns Whether the provided parameter is undefined or null.
   */
  export function isUndefinedOrNull(value: any): value is undefined | null {
    return value === null || isUndefined(value);
  }
  
  /**
   * @returns Whether the provided parameter is undefined.
   */
  export function isUndefined(value: any): value is undefined {
    return typeof value === 'undefined';
  }
  