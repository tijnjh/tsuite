import { tryCatch } from "typecatch";

type EffetchOptions = RequestInit & {
  /** Primarily for SvelteKit's load function */
  event?: { fetch: typeof fetch };
  responseType?: "json" | "text";
};

export async function effetch<T>(
  input: RequestInfo | URL,
  init?: EffetchOptions & { responseType?: "json" },
): Promise<T>;
export async function effetch(
  input: RequestInfo | URL,
  init: EffetchOptions & { responseType: "text" },
): Promise<string>;

/**
 * Effective fetch
 *
 * Sends the request and returns the response as parsed JSON (or text).
 *
 * @template T The expected type of the JSON response
 * @returns A promise that resolves to the parsed JSON or text data
 * @throws If the fetch request fails or if the JSON parsing fails
 */
export async function effetch<T>(
  input: RequestInfo | URL,
  init?: EffetchOptions,
): Promise<string | T> {
  const fetchFunction = init?.event?.fetch || fetch;

  const res = await tryCatch(fetchFunction(input, init));

  if (res.error) {
    throw new Error(`Failed to fetch: ${res.error}`);
  }

  if (!res.data) {
    throw new Error("Request sending failed unexpectedly.");
  }

  if (!res.data.ok) {
    throw new Error(
      `HTTP error! status: ${res.data?.status} ${res.data?.statusText}`,
    );
  }

  if (init?.responseType === "text") {
    return res.data.text();
  }

  const parse = await tryCatch(res.data.json());

  if (parse.error) {
    throw new Error(`Failed to parse JSON: ${parse.error}`);
  }

  return parse.data as T;
}
