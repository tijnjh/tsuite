type ToPascalCase<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Capitalize<Head>}${ToPascalCase<Tail>}`
  : Capitalize<S>;

type ElKey<S extends string> = `el${ToPascalCase<NormalizeIdentifier<S>>}`;

type Elements<T extends readonly string[]> = {
  [K in T[number] as ElKey<K>]: HTMLElement | null;
};

type NormalizeIdentifier<S extends string> =
  S extends `${infer Char}${infer Rest}`
    ? Char extends "-" // keep
      ? `-${NormalizeIdentifier<Rest>}`
      : Char extends
          | "."
          | "#"
          | "["
          | "]"
          | ":"
          | ">"
          | "+"
          | "~"
          | "*"
          | ","
          | "="
          | '"'
          | "'"
          | "("
          | ")"
          | "^"
          | "$"
          | "|"
          | "/"
          | "\\"
          | " "
      ? NormalizeIdentifier<Rest>
      : `${Char}${NormalizeIdentifier<Rest>}`
    : S;

const mapElementsBy = {
  /**
   * Returns an object mapping each query string to the corresponding HTMLElement
   * (or null) found by `id`. The object keys are in PascalCase and prefixed with "el".
   *
   * @template T - A tuple of string query names in kebab-case.
   * @param {...T} selectors - The list of id attribute names (in kebab-case) to query.
   * @returns An object with keys in the form `el<PascalCaseQuery>` and
   * values as the corresponding HTMLElement or null.
   *
   * @example
   * const els = mapElementsBy.id('foo-bar', 'baz');
   * // els.elFooBar -> HTMLElement | null (for id="foo-bar")
   * // els.elBaz    -> HTMLElement | null (for id="baz")
   */
  id: <const T extends readonly string[]>(...selectors: T): Elements<T> =>
    mapElements("getElementById", ...selectors),
  /**
   * Returns an object mapping each query string to the corresponding HTMLElement
   * (or null) found by query. The object keys are in PascalCase and prefixed with "el".
   *
   * @template T - A tuple of string query names in kebab-case.
   * @param {...T} selectors - The list of queries.
   * @returns An object with keys in the form `el<PascalCaseQuery>` and
   * values as the corresponding HTMLElement or null.
   *
   * @example
   * const els = mapElementsBy.query('.foo-bar', '#baz');
   * // els.elFooBar -> HTMLElement | null (for class="foo-bar")
   * // els.elBaz    -> HTMLElement | null (for id="baz")
   */
  query: <const T extends readonly string[]>(...selectors: T): Elements<T> =>
    mapElements("querySelector", ...selectors),
};

function mapElements<const T extends readonly string[]>(
  method: keyof Pick<Document, "getElementById" | "querySelector">,
  ...selectors: T
): Elements<T> {
  const elements = {} as Elements<T>;
  for (const selector of selectors) {
    const prop =
      "el" +
      selector
        .replace(/[^a-zA-Z0-9-]/g, "")
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");

    elements[prop as keyof Elements<T>] = document[method](
      selector
    ) as Elements<T>[keyof Elements<T>];
  }
  return elements;
}

export default mapElementsBy;
