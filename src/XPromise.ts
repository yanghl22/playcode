type Resolve = (value: any) => any;
type Reject = (reason: any) => any;
type ResolveType = Resolve | undefined;
type RejectType = Reject | undefined;
type Executor = (resolve: Resolve, reject: Reject) => void;
interface Handler {
  onFulfilled: ResolveType;
  onRejected: RejectType;
  nextResolve: ResolveType;
  nextReject: RejectType;
}
export default class XPromise {
  status = "pending";
  value = undefined;
  reason = undefined;
  handlers: Handler[] = [];
  constructor(executor: Executor) {
    executor(this.resolve, this.reject);
  }

  resolve = (value: any) => {
    if (value instanceof XPromise) {
      value.then(this.resolve);
      return;
    }
    console.log("XPromise resolved! value:", value);

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
      //   console.log("callback is pushed to handlers!");
      this.handlers.push(cb);
    } else if (this.status === "fulfilled") {
      let nextValue = onFulfilled && onFulfilled(this.value);
      nextValue && nextResolve && nextResolve(nextValue);
    } else {
      let nextReason = onRejected && onRejected(this.reason);
      nextReject && nextReject(nextReason);
    }
  };

  then = (
    onFulfilled: ResolveType = undefined,
    onRejected: RejectType = undefined
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


