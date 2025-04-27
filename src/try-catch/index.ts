type TryCatchSynchronousInput<T> = () => T;
type TryCatchAsynchronousInput<T> = Promise<T>;
type TryCatchAllInput = Record<string, () => any>;

type TryCatchSynchronousResult<T, E> = [T | null, E | null];
type TryCatchAsynchronousResult<T, E> = Promise<[T | null, E | null]>;
type TryCatchAllReturn<E> = [Record<string, any>, Record<string, E>];

type TryCatchInput<T> =
  | TryCatchSynchronousInput<T>
  | TryCatchAsynchronousInput<T>;

type TryCatchResult<T, E> =
  | TryCatchSynchronousResult<T, E>
  | TryCatchAsynchronousResult<T, E>;

const internalTryCatchForType = {
  function: <T, E = Error>(
    input: TryCatchSynchronousInput<T>
  ): TryCatchSynchronousResult<T, E> => {
    try {
      return [input(), null as any];
    } catch (error) {
      return [null as any, error as E];
    }
  },

  promise: <T, E = Error>(
    input: TryCatchAsynchronousInput<T>
  ): TryCatchAsynchronousResult<T, E> => {
    return input
      .then((data): [T, null] => [data, null])
      .catch((error): [null, E] => [null, error as E]);
  },

  object: <T extends Record<string, () => any>, E = Error>(
    input: T
  ): TryCatchAllReturn<E> => {
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
function tryCatch<T, E = Error>(
  func: TryCatchSynchronousInput<T>
): TryCatchSynchronousResult<T, E>;

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
function tryCatch<T, E = Error>(
  promise: TryCatchAsynchronousInput<T>
): TryCatchAsynchronousResult<T, E>;

/**
 * @deprecated Use tryCatch.all() instead
 */
// @ts-expect-error
function tryCatch<T, E = Error>(object: TryCatchAllInput): TryCatchAllReturn<E>;

function tryCatch<T, E = Error>(input: TryCatchInput<T>): TryCatchResult<T, E> {
  if (typeof input === "function") {
    return internalTryCatchForType.function<T, E>(input);
  }

  if (input instanceof Promise) {
    return internalTryCatchForType.promise(input);
  }

  throw new Error("Input must be a function or a promise.");
}

/**
 * Executes an object of functions and returns a tuple containing the results or errors.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param object An object of functions to execute.
 * @returns A tuple containing the results and errors.
 *
 * @example <caption>Handling an object of functions</caption>
 * const [res, err] = tryCatch.all({
 *   add: () => 1 + 2,
 *   fail: () => { throw new Error("Oops!"); },
 *   multiply: () => 2 * 3,
 * });
 * console.log("Results:", res); // { add: 3, multiply: 6 }
 * console.log("Errors:", err);  // { fail: Error("Oops!") }
 */

tryCatch.all = function <E = Error>(
  input: TryCatchAllInput
): TryCatchAllReturn<E> {
  if (typeof input === "object") {
    return internalTryCatchForType.object(input);
  }
  throw new Error("Input must be an object of functions.");
};

export default tryCatch;
