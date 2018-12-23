function curry(fn) {
    const len = fn.length;
    return function _fn() {
        let args = arguments;
        return args.length >= len ?
            fn.call(this, ...args) :
            function () {
                return _fn.call(this, ...args, ...arguments);
            }
    }
}

function thunkify(fn){

}

function add(a, b, c) {
    return a + b + c;
}

let cAdd = curry(add);
console.log(cAdd(1)(2)(3))