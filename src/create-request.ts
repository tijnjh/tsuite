import { tryCatch } from "typecatch";

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

  private async get(): Promise<void> {
    if (this.sendPromise) {
      await this.sendPromise;
      return;
    }

    this.sendPromise = (async () => {
      const fetchFunc = this.init?.event?.fetch || fetch;
      const res = await tryCatch(fetchFunc(this.input, this.init));

      if (res.error) {
        throw new Error(`Failed to fetch: ${res.error}`);
      }

      if (!res.data?.ok) {
        throw new Error(
          `HTTP error! status: ${res.data?.status} ${res.data?.statusText}`,
        );
      }

      this.response = res.data;
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
  async getJson<T>(): Promise<T> {
    await this.get();

    if (!this.response) {
      throw new Error("Request sending failed unexpectedly.");
    }

    const parse = await tryCatch(this.response.json());

    if (parse.error) {
      throw new Error(`Failed to parse JSON: ${parse.error}`);
    }

    return parse.data as T;
  }

  /**
   * Sends the request and returns the response as text.
   *
   * @returns A promise that resolves to a string
   * @throws If the fetch request fails
   */
  async getText(): Promise<string> {
    await this.get();

    if (!this.response) {
      throw new Error("Request sending failed unexpectedly.");
    }

    const parse = await tryCatch(this.response.text());

    if (parse.error) {
      throw new Error(`Failed to parse text: ${parse.error}`);
    }

    return parse.data;
  }
}

/**
 * Creates a new Request instance for making fetch requests.
 *
 * @deprecated use effetch instead
 *
 * @param input The input for the fetch request. This can be a URL string or a RequestInfo object.
 * @param init An optional object containing custom settings for the fetch request. This can include properties like `method`, `headers`, `body`, etc. It can also include an `event` property with a `fetch` function for custom fetch implementations (e.g., for testing).
 * @returns A Request instance. **Note: You should not call this function without chaining either the `.getJson()` or `.getText()` method to retrieve the response data.**
 * @example
 * // Correct usage:
 * createRequest('https://api.example.com/data').getJson()
 *   .then((data) => console.log(data))
 *   .catch((error) => console.error(error));
 *
 * // Incorrect usage (will not make the request):
 * const myRequest = createRequest('https://api.example.com/data'); // This won't trigger the fetch
 */
export function createRequest(input: FetchInput, init?: FetchInit) {
  return new Request(input, init);
}
