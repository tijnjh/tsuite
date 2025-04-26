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
    input: TryCatchFunctionInput<T>,
  ): TryCatchFunctionReturn<T, E> => {
    try {
      return [input(), null as any];
    } catch (error) {
      return [null as any, error as E];
    }
  },

  promise: <T, E = Error>(
    input: TryCatchPromiseInput<T>,
  ): TryCatchPromiseReturn<T, E> => {
    return input
      .then((data): [T, null] => [data, null])
      .catch((error): [null, E] => [null, error as E]);
  },

  object: <T extends Record<string, () => any>, E = Error>(
    input: T,
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
 * @example <caption>Handling a synchronous function</caption>
 * const [res, err] = tryCatch(() => {
 *   if (Math.random() > 0.5) throw new Error("Random error");
 *   return 42;
 * });
 * if (err) {
 *   console.error("Function failed:", err.message);
 * } else {
 *   console.log("Function succeeded:", res);
 * }
 */
export default function <T, E = Error>(
  func: TryCatchFunctionInput<T>,
): TryCatchFunctionReturn<T, E>;

/**
 * Executes a promise and returns a tuple containing the result or an error.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param promise A promise to execute.
 * @returns A promise that resolves to a tuple containing the result or an error.
 *
 * @example <caption>Handling a promise</caption>
 * const promise = new Promise<string>((resolve, reject) => {
 *   setTimeout(() => {
 *     if (Math.random() > 0.5) {
 *       reject(new Error("Random promise error"));
 *     } else {
 *       resolve("Promise success");
 *     }
 *   }, 1000);
 * });
 *
 * tryCatch(promise).then(([res, err]) => {
 *   if (err) {
 *     console.error("Promise failed:", err.message);
 *   } else {
 *     console.log("Promise succeeded:", res);
 *   }
 * });
 */
export default function <T, E = Error>(
  promise: TryCatchPromiseInput<T>,
): TryCatchPromiseReturn<T, E>;

/**
 * Executes an object of functions and returns a tuple containing the results or errors.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param object An object of functions to execute.
 * @returns A tuple containing the results and errors.
 *
 * @example <caption>Handling an object of functions</caption>
 * const [res, err] = tryCatch({
 *   add: () => 1 + 2,
 *   fail: () => { throw new Error("Oops!"); },
 *   multiply: () => 2 * 3,
 * });
 * console.log("Results:", res); // { add: 3, multiply: 6 }
 * console.log("Errors:", err);  // { fail: Error("Oops!") }
 */
export default function <T, E = Error>(
  object: TryCatchObjectInput<T>,
): TryCatchObjectReturn<T, E>;

/**
 * Executes a function, a promise, or an object of functions, and returns a tuple or object containing the result(s) or error(s).
 *
 * - If a function is provided, it executes the function and returns `[res, null]` if successful,
 *   or `[null, err]` if an error is thrown.
 * - If a promise is provided, it returns a promise that resolves to `[res, null]` if successful,
 *   or `[null, err]` if the promise is rejected.
 * - If an object of functions is provided, it executes each function and returns `[res, err]`,
 *   where `res` is an object of successful results and `err` is an object of errors keyed by function name (or `null` if no errors).
 *
 * @template T The type of the input object containing functions.
 * @template E The type of the error.
 * @param input A function to execute, a promise to resolve, or an object of functions.
 * @returns
 *   - For a function: `[res, err]`
 *   - For a promise: `Promise<[res, err]>`
 *   - For an object: `[res, err]`
 *
 * @throws {Error} If the input is neither a function, promise, nor an object of functions.
 *
 * @example <caption>Handling a synchronous function</caption>
 * const [res, err] = tryCatch(() => {
 *   if (Math.random() > 0.5) throw new Error("Random error");
 *   return 42;
 * });
 * if (err) {
 *   console.error("Function failed:", err.message);
 * } else {
 *   console.log("Function succeeded:", res);
 * }
 *
 * @example <caption>Handling a promise with async/await</caption>
 * async function run() {
 *   const promise = new Promise<string>((resolve, reject) => {
 *     setTimeout(() => {
 *       if (Math.random() > 0.5) reject(new Error("Random promise error"));
 *       else resolve("Promise success");
 *     }, 1000);
 *   });
 *   const [res, err] = await tryCatch(promise);
 *   if (err) {
 *     console.error("Promise failed:", err.message);
 *   } else {
 *     console.log("Promise succeeded:", res);
 *   }
 * }
 * run();
 *
 * @example <caption>Handling an object of functions</caption>
 * const [res, err] = tryCatch({
 *   add: () => 1 + 2,
 *   fail: () => { throw new Error("Oops!"); },
 *   multiply: () => 2 * 3,
 * });
 * console.log("Results:", res); // { add: 3, multiply: 6 }
 * console.log("Errors:", err);  // { fail: Error("Oops!") }
 */
export default function tryCatch<T, E = Error>(
  input: TryCatchInput<T>,
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
