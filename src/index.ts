import XPromise from "./XPromise";

const fetchDataAsync = (flag: boolean) => {
  return new XPromise((resolve, reject) => {
    setTimeout(() => {
      if (flag) {
        resolve(
          new XPromise((resolve, reject) => {
            setTimeout(() => {
              resolve(3);
            }, 0);
          })
        );
      } else {
        reject("internal error");
      }
    }, 0);
  });
};

fetchDataAsync(true)
  .then(
    (value) => {
      console.log("then value:", value);
      return value + 1;
    },
    (reason) => {
      console.log(reason);
    }
  )
  .then(() => console.log("finally finished"));

XPromise.reject("static reject error").then(undefined, (reason) => {
  console.log(reason);
  return "error";
});

XPromise.resolve("static resolved string").then((value) => {
  console.log(value);
  return "done";
});

XPromise.all([
  new XPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(1500);
    }, 1500);
  }),
  new XPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(1000);
    }, 1000);
  }),
]).then((value) => console.log(value));
