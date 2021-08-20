type Resolve = (value: any) => void;
type Reject = (reason: any) => void;
type OnFulfilled = (value : any) => any;
type OnRejected = (reason: any) => any;
type Executor = (resolve: Resolve, reject: Reject) => void;
interface Handler {
  onFulfilled?: OnFulfilled;
  onRejected?: OnRejected;
  nextResolve?: Resolve;
  nextReject?: Reject;
}
export default class XPromise {
  status = "pending";
  value = undefined;
  reason = undefined;
  handlers: Handler[] = [];
  constructor(executor: Executor) {
    executor(this.resolve, this.reject);
  }

  static resolve = (value: any) => {
    if (value instanceof XPromise) {
      return value;
    } else {
      return new XPromise((resolve, reject) => {
        resolve(value);
      });
    }
  };

  static reject = (reason: any) => {
    if (reason instanceof XPromise) {
      return reason;
    } else {
      return new XPromise((resolve, reject) => {
        reject(reason);
      });
    }
  };

  static race = (promises: XPromise[]): XPromise => {
    return new XPromise((resolve, reject) => {
      for (let promise of promises) {
        XPromise.resolve(promise).then(resolve, reject);
      }
    });
  };

  static all = (promises: XPromise[]): XPromise => {
    let count = promises.length;
    let values: any[] = [];
    return new XPromise((resolve, reject) => {
      for (let promise of promises) {
        XPromise.resolve(promise).then((value) => {
          values.push(value);
          if (values.length >= count) resolve(values);
        });
      }
    });
  };

  catch = (onRejected: Reject) => {
    this.then(onRejected);
  };

  finally = (onFinal: Resolve | Reject) => {
    this.then(onFinal, onFinal);
  };

  resolve = (value: any) => {
    if (this.status === "fulfilled") {
      return;
    }
    if (value instanceof XPromise) {
      value.then(this.resolve);
      return;
    }
    // console.log("XPromise resolved! value:", value);

    this.value = value;
    this.status = "fulfilled";
    this.handlers.forEach(this.handle);
  };

  reject = (reason: any) => {
    console.log("XPromise rejected! reason:", reason);
    this.reason = reason;
    this.status = "rejected";
  };

  handle = (cb: Handler) => {
    const { onFulfilled, onRejected, nextResolve, nextReject } = cb;

    if (this.status === "pending") {
      this.handlers.push(cb);
    } else if (this.status === "fulfilled") {
      let nextValue = onFulfilled && onFulfilled(this.value);
      nextValue && nextResolve && nextResolve(nextValue);
    } else {
      let nextReason = onRejected && onRejected(this.reason);
      nextReason && nextReject && nextReject(nextReason);
    }
  };

  then = (
    onFulfilled ? : Resolve,
    onRejected ?: Reject
  ) => {
    return new XPromise((nextResolve, nextReject) => {
      this.handle({
        onFulfilled,
        onRejected,
        nextResolve,
        nextReject,
      });
    });
  };
}
