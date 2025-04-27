type StateSideEffect<T> = (currentValue: T, previousValue?: T) => void;

class InternalState<T> {
  currentValue: T;

  sideEffect: StateSideEffect<T>;

  constructor(initialValue: T, sideEffect: StateSideEffect<T>) {
    this.currentValue = initialValue;
    this.sideEffect = sideEffect;
  }

  get() {
    return this.currentValue;
  }

  set(newValue: T) {
    const previousValue = this.currentValue;
    this.currentValue = newValue;
    this.sideEffect(this.currentValue, previousValue);
  }
}

/**
 * Creates a stateful value with an associated side-effect that runs
 * whenever the state is updated.
 *
 * @template T The type of the state value.
 * @param initialValue The initial value of the state.
 * @param sideEffect A function to run with the new and (optionally) previous value after each update.
 * @returns A tuple containing a getter and a setter for the state.
 *
 * @example
 * const [getCount, setCount] = createState(0, (value, prev) => {
 *   console.log('Count changed from', prev, 'to', value);
 * });
 * setCount(1); // Logs: Count changed from 0 to 1
 * console.log(getCount()); // 1
 */
export default function createState<T>(
  initialValue: T,
  sideEffect: StateSideEffect<T>
): [() => T, (newValue: T) => void] {
  const state = new InternalState(initialValue, sideEffect);
  return [state.get, state.set];
}
