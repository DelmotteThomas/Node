// Exemple de code moderne à transpiler avec SWC

import { add, greetUser } from "./utils.js";

class Person {
    #secret = "SWC transpile test";

    constructor(name) {
        this.name = name ?? "Unknown"; // Nullish coalescing
    }

    getSecret() {
        return this.#secret;
    }

    sayHello() {
        console.log(greetUser(this.name));
    }
}

const p = new Person("Marco");
p.sayHello();

console.log("Addition:", add(10, 20));

// Optional chaining test
const user = { profile: { email: "test@mail.com" } };
console.log("Email:", user?.profile?.email);

// Nullish coalescing test
const age = 0 ?? 18;
console.log("Age:", age);

// Private field usage
console.log("Secret field:", p.getSecret());
