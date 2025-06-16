export interface ServerActionResult<T> {
      success: boolean;
      message: string,
      payload?: T
}