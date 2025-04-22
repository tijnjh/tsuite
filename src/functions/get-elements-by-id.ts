/**
 * Converts a kebab-case string to PascalCase.
 *
 * @template S - The input string in kebab-case.
 */
type ToPascalCase<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Capitalize<Head>}${ToPascalCase<Tail>}`
  : Capitalize<S>;

/**
 * Prepends "el" to a PascalCase string.
 *
 * @template S - The input string in kebab-case.
 */
type ElKey<S extends string> = `el${ToPascalCase<S>}`;

/**
 * Maps an array of string keys to an object with PascalCase property names
 * prefixed by "el", each mapping to an HTMLElement or null.
 *
 * @template T - The array of string keys.
 */
type Elements<T extends readonly string[]> = {
  [K in T[number] as ElKey<K>]: HTMLElement | null;
};

/**
 * Returns an object mapping each query string to the corresponding HTMLElement
 * (or null) found by `id`. The object keys are in PascalCase and prefixed with "el".
 *
 * @template T - A tuple of string query names in kebab-case.
 * @param {...T} queries - The list of id attribute names (in kebab-case) to query.
 * @returns {Elements<T>} An object with keys in the form `el<PascalCaseQuery>` and
 * values as the corresponding HTMLElement or null.
 *
 * @example
 * const els = getElementsById('foo-bar', 'baz');
 * // els.elFooBar -> HTMLElement | null (for id="foo-bar")
 * // els.elBaz    -> HTMLElement | null (for id="baz")
 */
export default function <const T extends readonly string[]>(
  ...queries: T
): Elements<T> {
  const elements = {} as Elements<T>;
  for (const query of queries) {
    const prop =
      "el" +
      query
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
    elements[prop as keyof Elements<T>] = document.getElementById(
      query
    ) as Elements<T>[keyof Elements<T>];
  }
  return elements;
}
