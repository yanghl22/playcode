interface handler {
  onFulfilled: any;
  onRejected: any;
  nextResolve: any;
  nextReject: any;
}

type handlers = handler[];

class XPromise {
  status = "pending";
  value = undefined;
  reason = undefined;
  handlers: handlers = [];
  constructor(executor: any) {
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value: any) {
    console.log("XPromise resolved! value:", value);

    this.value = value;
    this.status = "fulfilled";
    this.handlers.forEach(this.handle.bind(this));
  }

  reject(reason: any) {
    console.log("XPromise rejected! reason:", reason);
    this.reason = reason;
    this.status = "rejected";
  }
  handle(cb: handler) {
    const { onFulfilled, onRejected, nextResolve, nextReject } = cb;
    if (this.status === "fulfilled") {
      let nextValue = onFulfilled(this.value);
      nextResolve(nextValue);
    }
  }
  then(onFulfilled: any, onRejected: any) {
    return new XPromise((nextResolve: any, nextReject: any) => {
      this.handlers.push({ onFulfilled, onRejected, nextResolve, nextReject });
    });
  }
}
const fetchData = (flag: boolean) => {
  return new XPromise((resolve: any, reject: any) => {
    setTimeout(() => {
      if (flag) {
        resolve(5);
      } else {
        reject("error");
      }
    }, 1000);
  });
};

fetchData(true).then((value: any) => {
  console.log("then value:", value);
}, null);
