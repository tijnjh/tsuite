import { tryCatch } from ".."; // Assuming 'tryCatch' is imported correctly

type FetchInput = RequestInfo | URL;
type FetchInit = RequestInit & { event?: { fetch: typeof fetch } };

class Request {
  input: FetchInput;
  init?: FetchInit;
  private response: Response | undefined;
  private sendPromise: Promise<void> | undefined;

  constructor(input: FetchInput, init?: FetchInit) {
    this.input = input;
    this.init = init;
  }

  private async send(): Promise<void> {
    if (this.sendPromise) {
      await this.sendPromise;
      return;
    }

    this.sendPromise = (async () => {
      const fetchFunc = this.init?.event?.fetch || fetch;
      const [fetchRes, fetchErr] = await tryCatch(
        fetchFunc(this.input, this.init)
      );

      if (fetchErr) {
        throw new Error(`Failed to fetch: ${fetchErr}`);
      }

      if (!fetchRes?.ok) {
        throw new Error(
          `HTTP error! status: ${fetchRes?.status} ${fetchRes?.statusText}`
        );
      }

      this.response = fetchRes;
    })();

    await this.sendPromise;
  }

  /**
   * Sends the request and returns the response as parsed JSON.
   *
   * @template T The expected type of the JSON response
   * @returns A promise that resolves to the parsed JSON data
   * @throws If the fetch request fails or if the JSON parsing fails
   */
  async json<T>(): Promise<T> {
    await this.send(); // Await the send operation

    // Check if response is defined after sending
    if (!this.response) {
      // This case should ideally not be reached if send() throws on failure,
      // but it's good practice for type safety.
      throw new Error("Request sending failed unexpectedly.");
    }

    const [parseRes, parseErr] = await tryCatch(this.response.json());

    if (parseErr) {
      throw new Error(`Failed to parse JSON: ${parseErr}`);
    }

    return parseRes as T;
  }

  /**
   * Sends the request and returns the response as text.
   *
   * @returns A promise that resolves to a string
   * @throws If the fetch request fails
   */
  async text(): Promise<string> {
    await this.send();

    if (!this.response) {
      throw new Error("Request sending failed unexpectedly.");
    }

    const [parseRes, parseErr] = await tryCatch(this.response.text());

    if (parseErr) {
      throw new Error(`Failed to parse text: ${parseErr}`);
    }

    return parseRes as string;
  }
}

/**
 * Creates a new Request instance for making fetch requests.
 *
 * @param input The input for the fetch request. This can be a URL string or a Request object.
 * @param init An optional object containing custom settings for the fetch request. This can include properties like `method`, `headers`, `body`, etc. It can also include an `event` property with a `fetch` function for custom fetch implementations (e.g., for testing).
 * @returns A Request instance. **Note: You should not call this function without chaining either the `.json()` or `.text()` method to retrieve the response data.**
 * @example
 * // Correct usage:
 * createRequest('https://api.example.com/data').json()
 *   .then((data) => console.log(data))
 *   .catch((error) => console.error(error));
 *
 * // Incorrect usage (will not make the request):
 * const myRequest = createRequest('https://api.example.com/data'); // This won't trigger the fetch
 */
export default function createRequest(input: FetchInput, init?: FetchInit) {
  return new Request(input, init);
}
