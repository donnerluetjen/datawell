class DataWell {
    #data = [];
    #capacity;
    #sorted = false;
    #sortOnProperty = "";

    constructor(capacity, sorted = false, sortOnProperty = "id") {
        if (!(Number.isInteger(capacity)) || capacity <= 0) {
            throw new Error('You must supply the capacity as a positive integer value');
        }
        if (!(typeof sorted === "boolean")) {
            throw new Error('You must supply the sorted argument as a boolean value');
        }
        if (!(typeof sortOnProperty === "string")) {
            throw new Error('You must supply the sortOnProperty argument as a string value');
        }
        this.#capacity = capacity;
        this.#sorted = sorted;
        this.#sortOnProperty = sortOnProperty;
    }

    push(data) {
        // if the DataWell would hold more than capacity after push, the oldest entry will be dropped
        // if data[n].id is already contained, than data[n] will be updated
        const pushSingleObject = (element, index = 0) => {
            if (this.#sorted) {
                // check if sortOnProperty is present
                if (!Object.hasOwn(element, this.#sortOnProperty)) {
                    throw new Error(`Supplied data in element ${index} does not contain the property ${this.#sortOnProperty}, which you defined to sort on.`);
                }
                if (Object.hasOwn(element, this.#sortOnProperty) && typeof element[this.#sortOnProperty] !== "number") {
                    throw new Error(`Supplied data property ${this.#sortOnProperty} to sort on in element ${index} is not a number.`);
                }
            }
            // push only if id is not already present
            const notFound = -1;
            const id = element[this.#sortOnProperty];
            const element_id = this.#data.findIndex((e => e[this.#sortOnProperty] === id));

            if (this.#sorted && element_id !== notFound) {
                // update found element
                this.#data[element_id] = {...this.#data[element_id], ...element};
            } else {
                this.#data.push(element);
            }
        };

        if (Array.isArray(data)) {
            data.forEach((element, index) => {
                pushSingleObject(element, index);
            });
        } else {
            pushSingleObject(data);
        }

        if (this.#sorted) {
            this.#data.sort((a, b) => {
                // there are no duplicates as they would be updated
                return (a[this.#sortOnProperty] < b[this.#sortOnProperty]) ? -1 : 1;
            });
        }

        // restrict to maxLength items by removing the oldest
        while (this.#data.length > this.#capacity) {
            this.#data.shift();
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

