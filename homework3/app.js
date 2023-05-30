//task 1

const fs = require("fs");
fs.readFile(__filename, () => {
  console.log("1");
  setImmediate(() => console.log("2"));
  process.nextTick(() => console.log("3"));
  Promise.resolve().then(() => console.log("4"));
});
process.nextTick(() => console.log("5"));
Promise.resolve().then(() => console.log("6"));
setTimeout(() => console.log("7"));
for (let i = 0; i < 2000000000; i++) { }

//my output 5 6 1 3 4 2 7
//output 5 6 7 1 3 4 2

//քանի որ կա nextTick ու promise , ապա առաջինը execute կլինեն նրանք,
//հետո macrotask կմտնեն fs-ը  և setTimeout-ը


//task 2  

const fs = require("fs");
setTimeout(() => {
  console.log(1);
});
setTimeout(() => {
  console.log(2);
  process.nextTick(() => {
    console.log(3);
  });
  setImmediate(() => {
    console.log(4);
  });
});

setTimeout(() => {
  console.log(5);
});

setTimeout(() => {
  console.log(6);
  Promise.resolve(7).then((res) => {
    console.log(res);
  });
});

setTimeout(() => {
  console.log(8);
  fs.readFile(__filename, () => {
    console.log(9);
  });
});

//output - 1,2,3,5,6,7,8,4,9
//1ը մտնում է macrotask queue և աշխատում է, հետո 2ն է մտնում macrotask, 3֊ը մնտում է microtask և
// քանի որ nextTick է , ապա միանգամից execute է լինում, 4ը մտնում է macrotask և  սպասում է
//5ը մտնում է macrotask և execute է լինում,6֊ը մտնում է macrotask, աշխատում է, և հետո քանի որ 7֊ը promiseէ ապա մտնում է microtask և աշխատում է
// 8֊ը աշխատում է, հետո աշխատում է 4֊ը, և հետո վերջում fs-ը

//task 3

const fs = require("fs");
console.log(1);
setTimeout(() => console.log("2"));
setImmediate(() => console.log("3"));
process.nextTick(() => console.log("4"));
fs.readFile(__filename, () => {
  console.log(13);
  setTimeout(() => console.log("5"));
  setImmediate(() => console.log("6"));
  process.nextTick(() => console.log("7"));
});
setTimeout(() => console.log("8"));
setImmediate(() => {
  console.log("9");
  process.nextTick(() => console.log("11"));
});
setImmediate(() => {
  console.log("12");
});
process.nextTick(() => console.log("10"));

//my output 1 4 10 2 3 8 9 11 12 13 7 5 6
//output 1 4 10 2 3 9 11 12 8 13 7 6 5
//output 1 4 10 2 8 3 9 11 12 13 7 6 5 (after running several times in terminal) 
//առաջինը աշխատում է 1ը, հետո microtask են մտնում nextTick֊երը, և execute է լինում 4, 10
//հետո setTimeout֊ն է execute լինում և տպում է 2,հետո 3 
//ու հետո ես արդեն թարս եմ արել ։Դ

// //task 4

const fs = require("fs");
fs.readFile(__filename, () => {
  console.log(0);
});
setImmediate(() => {
  console.log(1);
});
setImmediate(() => {
  console.log(2);
});
setImmediate(() => {
  console.log(3);
});
setImmediate(() => {
  console.log(4);
  Promise.resolve(5).then((res) => {
    console.log(res);
  });
});
setImmediate(() => {
  console.log(6);
});
setImmediate(() => {
  console.log(7);
});
setImmediate(() => {
  console.log(8);
});
setTimeout(() => {
  console.log(9);
}, 1000)

// output 1 2 3 4 5 6 7 8 0 9
//առաջին 8  setImmediate հերով մտնում են macrotask և execute լինում, և քանի 
//որ fs֊ի ժամանակը ավելի քիչ է քան setTimeout֊ինը ապա սկզբում execute կլինի fs-ը հետո setTimeout-ը
