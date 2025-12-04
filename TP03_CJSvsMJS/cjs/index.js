const { add, subtract } = require('./math.js');
//import { subtract } from './math.js';

// import fonctionne pas en commonjs

console.log(add(10,5));
console.log(subtract(10,5));


const math = require('./math.js');
console.log(math.add(20,10));
console.log(math.subtract(20,10));

