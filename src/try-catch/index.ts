/**
 * Executes a function and returns a tuple containing the result or an error.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param {Function} fn - A function to execute.
 * @returns {[T|null, E|null]} A tuple containing the result or an error.
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
export default function <T, E = Error>(fn: () => T): [T | null, E | null];

/**
 * Executes a promise and returns a tuple containing the result or an error.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param {Promise<T>} promise - A promise to execute.
 * @returns {Promise<[T|null, E|null]>} A tuple containing the result or an error.
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
  promise: Promise<T>
): Promise<[T | null, E | null]>;

/**
 * Executes a function or a promise and returns a tuple containing the result or an error.
 *
 * - If a function is provided, it executes the function and returns `[result, null]` if successful,
 *   or `[null, error]` if an error is thrown.
 * - If a promise is provided, it returns a promise that resolves to `[result, null]` if successful,
 *   or `[null, error]` if the promise is rejected.
 *
 * @template T The type of the result.
 * @template E The type of the error.
 * @param {(() => T) | Promise<T>} input - A function to execute or a promise to resolve.
 * @returns {([T|null, E|null] | Promise<[T|null, E|null]>)} A tuple containing the result or an error,
 *   or a promise that resolves to such a tuple.
 *
 * @throws {Error} If the input is neither a function nor a promise.
 *
 * @example <caption>With a function</caption>
 * const [result, error] = tryCatch(() => {
 *   if (Math.random() > 0.5) throw new Error("Random error");
 *   return "Success";
 * });
 *
 * @example <caption>With a promise</caption>
 * const promise = new Promise((resolve, reject) => {
 *   setTimeout(() => {
 *     if (Math.random() > 0.5) reject(new Error("Random promise error"));
 *     else resolve("Promise success");
 *   }, 1000);
 * });
 * tryCatch(promise).then(([result, error]) => {
 *   // handle result or error
 * });
 */
export default function tryCatch<T, E = Error>(
  input: (() => T) | Promise<T>
): Promise<[T | null, E | null]> | [T | null, E | null] {
  if (typeof input === "function") {
    try {
      return [input(), null];
    } catch (error) {
      return [null, error as E];
    }
  } else if (input instanceof Promise) {
    return input
      .then((data): [T, null] => [data, null])
      .catch((error): [null, E] => [null, error as E]);
  } else {
    throw new Error("Input must be a function or a promise.");
  }
}
