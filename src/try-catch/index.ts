type TryCatchFunctionInput<T> = () => T;
type TryCatchPromiseInput<T> = Promise<T>;
type TryCatchObjectInput<T> = Record<string, () => any>;

type TryCatchFunctionReturn<T, E> = [T | null, E | null];
type TryCatchPromiseReturn<T, E> = Promise<[T | null, E | null]>;
type TryCatchObjectReturn<T, E> = [Record<string, any>, Record<string, E>];

type TryCatchInput<T> =
  | TryCatchFunctionInput<T>
  | TryCatchPromiseInput<T>
  | TryCatchObjectInput<T>;

type TryCatchResult<T, E> =
  | TryCatchFunctionReturn<T, E>
  | TryCatchPromiseReturn<T, E>
  | TryCatchObjectReturn<T, E>;

const internalTryCatchForType = {
  function: <T, E = Error>(
    input: TryCatchFunctionInput<T>
  ): TryCatchFunctionReturn<T, E> => {
    try {
      return [input(), null as any];
    } catch (error) {
      return [null as any, error as E];
    }
  },

  promise: <T, E = Error>(
    input: TryCatchPromiseInput<T>
  ): TryCatchPromiseReturn<T, E> => {
    return input
      .then((data): [T, null] => [data, null])
      .catch((error): [null, E] => [null, error as E]);
  },

  object: <T extends Record<string, () => any>, E = Error>(
    input: T
  ): TryCatchObjectReturn<T, E> => {
    const errors: { [K in keyof T]?: E } = {};
    const responses: { [K in keyof T]: ReturnType<T[K]> } = {} as any;

    for (const [key, val] of Object.entries(input)) {
      try {
        responses[key as keyof T] = val();
      } catch (error) {
        errors[key as keyof T] = error as E;
      }
    }

    return [responses, Object.keys(errors).length === 0 ? null : errors];
  },
};

/**
 * Executes a function and returns a tuple containing the result or an error.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param func A function to execute.
 * @returns A tuple containing the result or an error.
 *
 * @example
 * const [result, error] = tryCatch(() => {
 *   if (Math.random() > 0.5) {
 *     throw new Error("Random error");
 *   }
 *   return "Success";
 * });
 *
 * if (error) {
 *   console.error("Function failed:", error.message);
 * } else {
 *   console.log("Function succeeded:", result);
 * }
 */
export default function <T, E = Error>(
  func: TryCatchFunctionInput<T>
): TryCatchFunctionReturn<T, E>;

/**
 * Executes a promise and returns a tuple containing the result or an error.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param promise A promise to execute.
 * @returns A promise that resolves to a tuple containing the result or an error.
 *
 * @example
 * const promise = new Promise((resolve, reject) => {
 *   setTimeout(() => {
 *     if (Math.random() > 0.5) {
 *       reject(new Error("Random promise error"));
 *     } else {
 *       resolve("Promise success");
 *     }
 *   }, 1000);
 * });
 *
 * tryCatch(promise).then(([result, error]) => {
 *   if (error) {
 *     console.error("Promise failed:", error.message);
 *   } else {
 *     console.log("Promise succeeded:", result);
 *   }
 * });
 */
export default function <T, E = Error>(
  promise: TryCatchPromiseInput<T>
): TryCatchPromiseReturn<T, E>;

/**
 * Executes an object of functions and returns a tuple containing the results or an error.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param object An object of functions to execute.
 * @returns A tuple containing the results or errors.
 *
 * @example
 * // Returns [results, errors], where each is an object keyed by the original function names.
 * const [results, errors] = tryCatch({
 *   add: () => 1 + 2,
 *   fail: () => { throw new Error("Oops!"); },
 *   multiply: () => 2 * 3,
 * });
 * console.log("Results:", results); // { add: 3, multiply: 6 }
 * console.log("Errors:", errors);   // { fail: Error("Oops!") }
 */
export default function <T, E = Error>(
  object: TryCatchObjectInput<T>
): TryCatchObjectReturn<T, E>;

/**
 * Executes a function, a promise, or an object of functions, and returns a tuple or object containing the result(s) or error(s).
 *
 * - If a function is provided, it executes the function and returns `[result, null]` if successful,
 *   or `[null, error]` if an error is thrown.
 * - If a promise is provided, it returns a promise that resolves to `[result, null]` if successful,
 *   or `[null, error]` if the promise is rejected.
 * - If an object of functions is provided, it executes each function and returns an array:
 *   `[results, errors]`, where `results` is an object of successful results and `errors` is an object of errors keyed by function name.
 *
 * @template T The type of the input object containing functions.
 * @template E The type of the error.
 * @param input A function to execute, a promise to resolve, or an object of functions.
 * @returns
 *   - For a function: `[result, error]`
 *   - For a promise: `Promise<[result, error]>`
 *   - For an object: `[results, errors]`
 *
 * @throws {Error} If the input is neither a function, a promise, nor an object of functions.
 *
 * @example <caption>Handling a synchronous function</caption>
 * // Returns [number, null] if successful, or [null, Error] if an error is thrown.
 * const [result, error] = tryCatch(() => {
 *   if (Math.random() > 0.5) throw new Error("Random error");
 *   return 42;
 * });
 * if (error) {
 *   console.error("Function failed:", error.message);
 * } else {
 *   console.log("Function succeeded:", result);
 * }
 *
 * @example <caption>Handling a promise</caption>
 * // Returns a promise that resolves to [string, null] or [null, Error].
 * const promise = new Promise((resolve, reject) => {
 *   setTimeout(() => {
 *     if (Math.random() > 0.5) reject(new Error("Random promise error"));
 *     else resolve("Promise success");
 *   }, 1000);
 * });
 * tryCatch(promise).then(([result, error]) => {
 *   if (error) {
 *     console.error("Promise failed:", error.message);
 *   } else {
 *     console.log("Promise succeeded:", result);
 *   }
 * });
 *
 * @example <caption>Handling an object of functions</caption>
 * // Returns [results, errors], where each is an object keyed by the original function names.
 * const [results, errors] = tryCatch({
 *   add: () => 1 + 2,
 *   fail: () => { throw new Error("Oops!"); },
 *   multiply: () => 2 * 3,
 * });
 * console.log("Results:", results); // { add: 3, multiply: 6 }
 * console.log("Errors:", errors);   // { fail: Error("Oops!") }
 */
export default function tryCatch<T, E = Error>(
  input: TryCatchInput<T>
): TryCatchResult<T, E> {
  if (typeof input === "function") {
    return internalTryCatchForType.function<T, E>(input);
  }

  if (input instanceof Promise) {
    return internalTryCatchForType.promise(input);
  }

  if (typeof input === "object") {
    return internalTryCatchForType.object(input);
  }

  throw new Error("Input must be a function, promise, or an object.");
}
