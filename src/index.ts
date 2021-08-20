import XPromise from "./XPromise";

const fetchData = (flag: boolean) => {
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
        reject("error");
      }
    }, 0);
  });
};

fetchData(true).then((value) => {
  console.log("then value:", value);
  return value + 1;
});

console.log("1");
