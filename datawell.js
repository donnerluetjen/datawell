/*
The DataWell class implements a stack. It has a capacity that cannot be exceeded.
Should a push result in exceeding the capacity, the oldest element will be dropped.
The DataWell cannot be empty, nor can you remove an element. You can only read the top element or
the whole contents of the DataWell.
The DataWell class expects the following structure {<data>}.
Optionally the array can be kept sorted ascending, default is push order. If the array should be kept sorted,
a sortOnAttribute can be passed, default is <id>, to tell the DataWell which attribute to sort on.
The attribute to sort on must be of type number.
 */
class DataWell {
    #data = [];
    #capacity;
    #sorted = false;
    #sortOnAttribute = "";

    constructor(capacity, sorted = false, sortOnAttribute = "id") {
        this.#capacity = capacity;
        this.#sorted = sorted;
        this.#sortOnAttribute = sortOnAttribute;
    }

    push(data) {
        // expects array of <data>
        // if the DataWell would hold more than capacity after push, the oldest entry will be dropped
        // if data[n].id is already contained, than data[n] will be updated
        data.forEach((element, index) => {
            // check if sortOnAttribute is present
            if (this.#sorted) {
                if (!Object.hasOwn(element, this.#sortOnAttribute)) {
                    throw new Error(`Supplied data in element ${ index } does not contain the attribute ${ this.#sortOnAttribute }, which you defined to sort on.`);
                }
                if (Object.hasOwn(element, this.#sortOnAttribute) &&
                    typeof element[this.#sortOnAttribute] !== "number") {
                    throw new Error(`Supplied data attribute ${ this.#sortOnAttribute } to sort on in element ${ index } is not a number.`);
                }
            }
            // push only if id is not already present
            const notFound = -1;
            const id = element[this.#sortOnAttribute];
            const element_id = this.#data.findIndex((e => e[this.#sortOnAttribute] === id));

            if (this.#sorted && element_id !== notFound) {
                // update found element
                const merged = {...this.#data[element_id], ...element};
                this.#data[element_id] = merged;
            } else {
                this.#data.push(element);
            }
        });
        // restrict to maxLength items by removing the oldest
        while (this.#data.length > this.#capacity) {
            this.#data.shift();
        }
        if (this.#sorted) {
            this.#data.sort((a, b) => {
                if (a[this.#sortOnAttribute] < b[this.#sortOnAttribute]) return -1;
                if (a[this.#sortOnAttribute] > b[this.#sortOnAttribute]) return 1;
                if (a[this.#sortOnAttribute] === b[this.#sortOnAttribute]) return 0;
            });
        }
    };

    content() {
        return this.#data;
    }

    top() {
        return this.#data.slice(-1)[0];
    }

    capacity() {
        return this.#capacity;
    }

    count() {
        return this.#data.length;
    };

    isFull() {
        return (this.#data.length === this.#capacity);
    }

    isEmpty() {
        return (this.#data.length === 0);
    }
}

module.exports = DataWell;

