enum AsyncStorageErrorType {
  /**
   * Related to RN Native module itself, ex. not initialized or null at app boot
   */
  NativeModuleError = "NativeModuleError",

  /**
   * Related to web storage (indexedDB)
   * https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/error
   */
  WebStorageError = "WebStorageError",

  /**
   * Error thrown from Sqlite itself
   * https://www.sqlite.org/rescode.html
   */
  SqliteStorageError = "SqliteStorageError",

  /**
   * Other errors related to Native Shared Storage or Legacy Storage exception.
   * ex. Storage could not be initialized or wrongly formatted output is generated
   */
  OtherStorageError = "OtherStorageError",

  /**
   * Catch-all case, where we can't really tell what went wrong
   */
  UnknownError = "UnknownError",
}

export class AsyncStorageError extends Error {
  private constructor(
    public errorMessage: string,
    public type: AsyncStorageErrorType
  ) {
    super(errorMessage);
    this.name = this.constructor.name;
  }

  static nativeError(e: unknown): AsyncStorageError {
    // do not override own error
    if (e instanceof AsyncStorageError) {
      return e;
    }

    const error = getNativeError(e);
    if (!error) {
      return new AsyncStorageError(
        (e as { message?: string })?.message ?? `Unknown error ${e}`,
        AsyncStorageErrorType.UnknownError
      );
    }

    let errorType: AsyncStorageErrorType = AsyncStorageErrorType.UnknownError;

    switch (error.type) {
      case "SqliteException":
        errorType = AsyncStorageErrorType.SqliteStorageError;
        break;
      case "OtherException":
      case "LegacyStorageException":
        errorType = AsyncStorageErrorType.OtherStorageError;
        break;
    }

    return new AsyncStorageError(error.message, errorType);
  }

  static jsError(
    error: string,
    type: AsyncStorageErrorType
  ): AsyncStorageError {
    return new AsyncStorageError(error, type);
  }

  static Type = AsyncStorageErrorType;
}

// Native module reject promises with special code
function isNativeError(e: unknown): e is PotentialNativeError {
  if (e === null || typeof e !== "object") {
    return false;
  }

  const err = e as Record<string, string>;
  return !!err.message && err?.code === "AsyncStorageError";
}

function getNativeError(e: unknown): AsyncStorageNativeError | null {
  if (!isNativeError(e)) {
    return null;
  }

  const errorType = e.userInfo ? e.userInfo["type"] : null;

  switch (errorType) {
    case "SqliteException": {
      return {
        type: "SqliteException",
        message: e.message,
      };
    }
    case "OtherException": {
      return {
        type: "OtherException",
        message: e.message,
      };
    }
    case "LegacyStorageException": {
      return {
        type: "LegacyStorageException",
        message: e.message,
      };
    }
  }

  return null;
}

type AsyncStorageNativeError = {
  message: string;
  type: "SqliteException" | "OtherException" | "LegacyStorageException";
};

type PotentialNativeError = {
  message: string;
  code: "AsyncStorageError";
  userInfo: Record<string, unknown> | null;
};
