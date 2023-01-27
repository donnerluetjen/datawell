const DataWell = require("./datawell");
let sut = null;
const CAPACITY = 10;
const SORT_ON_PROPERTY = "timestamp";

beforeEach(() => {
     sut = new DataWell(CAPACITY, true, SORT_ON_PROPERTY);
});

afterEach(() => {
    sut = null;
});

/*
 *** Helper Functions ***
 */

const maxData = () => {
    let data = [];
    for (let i = 0; i < CAPACITY; i++) {
        const element = new Object;
        element.sample = i;
        element[SORT_ON_PROPERTY] = i;

        data.push(element);
    }
    return data;
}

const singleData = (id, reference = id) => {
    const element = new Object;
    element.sample = reference;
    element[SORT_ON_PROPERTY] = id;
    return element;
}
/*
 *** Test Initialization ***
 */

test('DataWell throws error when initialized without capacity', () => {
    let initSut;
    expect(() => {
        initSut = new DataWell();
    }).toThrow('You must supply the capacity as a positive integer value');
})

test('DataWell throws error when supplied capacity is not an integer', () => {
    let initSut;
    expect(() => {
        initSut = new DataWell(10.7);
    }).toThrow('You must supply the capacity as a positive integer value');
    initSut = null;
    expect(() => {
        initSut = new DataWell("10");
    }).toThrow('You must supply the capacity as a positive integer value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(true);
    }).toThrow('You must supply the capacity as a positive integer value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(-10);
    }).toThrow('You must supply the capacity as a positive integer value');
    initSut = null;
})

test('DataWell does not throw error when initialized without arguments for sorted and sortOnProperty', () => {
    let initSut;
    expect(() => {
        initSut = new DataWell(10);
    }).not.toThrow();
    initSut = null;
})

test('DataWell does not throw error when initialized without argument for sortOnProperty', () => {
    let initSut;
    expect(() => {
        initSut = new DataWell(10, true);
    }).not.toThrow();
    initSut = null;
})

test('DataWell throws error when supplied sorted argument is not a boolean', () => {
    let initSut;
    expect(() => {
        initSut = new DataWell(10, 10);
    }).toThrow('You must supply the sorted argument as a boolean value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(10, "10");
    }).toThrow('You must supply the sorted argument as a boolean value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(10,-10);
    }).toThrow('You must supply the sorted argument as a boolean value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(10, 10.1);
    }).toThrow('You must supply the sorted argument as a boolean value');
    initSut = null;
})

test('DataWell throws error when supplied sortOnProperty argument is not a string', () => {
    let initSut;
    expect(() => {
        initSut = new DataWell(10, true, 10);
    }).toThrow('You must supply the sortOnProperty argument as a string value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(10, true, -10.1);
    }).toThrow('You must supply the sortOnProperty argument as a string value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(10, true, true);
    }).toThrow('You must supply the sortOnProperty argument as a string value');
    initSut = null;
    expect(() => {
        initSut = new DataWell(10,true, false);
    }).toThrow('You must supply the sortOnProperty argument as a string value');
    initSut = null;
})

/*
 *** Test of Status Functions ***
 */

test("DataWell is empty upon creation", () => {
    expect(sut.count()).toBe(0);
});

test("DataWell capacity upon creation returns the capacity", () => {
    expect(sut.capacity()).toBe(CAPACITY);
})

test("DataWell capacity after push returns the capacity", () => {
    sut.push(singleData(0));
    expect(sut.capacity()).toBe(CAPACITY);
    sut.push(maxData());
    expect(sut.capacity()).toBe(CAPACITY);
})

test('DataWell.isEmpty returns true if empty', () => {
    expect(sut.isEmpty()).toBeTruthy();
})

test('DataWell.isEmpty returns false if not empty', () => {
    sut.push(singleData(1));
    expect(sut.isEmpty()).toBeFalsy();
    sut.push(maxData());
    expect(sut.isEmpty()).toBeFalsy();
})

test('DataWell.isEmpty returns false if full', () => {
    sut.push(maxData());
    expect(sut.isEmpty()).toBeFalsy();
})

test('DataWell.isFull returns false if empty', () => {
    expect(sut.isFull()).toBeFalsy();
})

test('DataWell.isFull returns false if not empty and not full', () => {
    sut.push(singleData(1));
    expect(sut.isFull()).toBeFalsy();
})

test('DataWell.isFull returns true if full', () => {
    sut.push(maxData());
    expect(sut.isFull()).toBeTruthy();
})

/*
 *** Test Push Function ***
 */

test('DataWell.push will accept a single object', () => {
    expect(() => {
        sut.push(singleData(0));;
    }).not.toThrow();
});
test('DataWell.push will accept a list with a single object', () => {
    expect(() => {
        sut.push([singleData(1)]);;
    }).not.toThrow();
});
test('DataWell.push will accept a list of objects', () => {
    expect(() => {
        sut.push(maxData());
    }).not.toThrow();
});

test('Sorted DataWell to contain one item when one item was pushed', () => {
    sut.push(singleData(1));
    expect(sut.count()).toBe(1);
});

test('Sorted DataWell to accept a list of items for push', () => {
    sut.push(maxData());
    expect(sut.isFull()).toBeTruthy();
});

test('DataWell will only hold CAPACITY elements', () => {
    sut.push(maxData());
    sut.push(singleData(CAPACITY + 1));
    expect(sut.count()).toBe(CAPACITY);
});

test('Sorted DataWell will only hold highest CAPACITY elements pushed', () => {
    sut.push(singleData(CAPACITY + 1));
    sut.push(maxData());
    expect(sut.top()[SORT_ON_PROPERTY]).toBe(CAPACITY + 1);
});

test('Sorted DataWell will position higher id to top of stack', () => {
    const sampleData = singleData(8);
    sut.push(sampleData);
    for (let i = 0; i < 8; i++) {
        sut.push(singleData(i));
    }
    expect(sut.count()).toBe(9);

    expect(sut.top()).toEqual(sampleData);
})

test('Sorted DataWell will override data with same SORT_ON_PROPERTY', () => {
    for (let i = 0; i < 9; i++) {
        sut.push(singleData(i));
    }
    let variedData = singleData(8, 8.1);
    sut.push(variedData);
    expect(sut.count()).toBe(9);

    expect(sut.top()).toEqual(variedData);
})

test('Unsorted DataWell will push data with same SORT_ON_PROPERTY to top', () => {
    let noSortSut = new DataWell(CAPACITY, false, SORT_ON_PROPERTY);
    noSortSut.push(maxData());
    const unsortedData = singleData(0);
    noSortSut.push(unsortedData);

    expect(noSortSut.top()).toEqual(unsortedData);
})

test('Sorted DataWell will throw an error if the property to be sorted on does not exist', () => {
    const invalidPropertyData = new Object;
    invalidPropertyData.sample = 1;
    invalidPropertyData['not_a_' + SORT_ON_PROPERTY] = 1;
    expect(() => {
        sut.push(invalidPropertyData);
    }).toThrow(`Supplied data in element 0 does not contain the property ${ SORT_ON_PROPERTY }, which you defined to sort on.`);
})

test('Unsorted DataWell does not throw an error if the property to be sorted on does not exist', () => {
    let noSortSut = new DataWell(CAPACITY, false, SORT_ON_PROPERTY);
    const invalidPropertyData = new Object;
    invalidPropertyData.sample = 1;
    invalidPropertyData['not_a_' + SORT_ON_PROPERTY] = 1;
    expect(() => {
        noSortSut.push(invalidPropertyData);
    }).not.toThrow();
})

test('Sorted DataWell will throw an error if the property to be sorted on is not a of type number', () => {
    let invalidPropertyData = singleData('1', 1);
    expect(() => {
        sut.push(invalidPropertyData);
    }).toThrow(`Supplied data property ${ SORT_ON_PROPERTY } to sort on in element 0 is not a number.`);
    invalidPropertyData = singleData(true, 1);
    data = [
        singleData(0),
        invalidPropertyData
    ];
    expect(() => {
        sut.push(data);
    }).toThrow(`Supplied data property ${ SORT_ON_PROPERTY } to sort on in element 1 is not a number.`);
})

test('Unsorted DataWell does not throw an error if the property to be sorted on is not a of type number', () => {
    let noSortSut = new DataWell(CAPACITY, false, 'SORT_ON_PROPERTY');
    let invalidPropertyData = singleData('1', 1);
    expect(() => {
        noSortSut.push(invalidPropertyData);
    }).not.toThrow();
})

test('Sorted DataWell will merge new data with old data when processing data with same sortOnproperty', () => {
    sut.push(maxData());
    const sampleData1 = singleData(CAPACITY - 1);
    const sampleData2 = {...sampleData1, otherData: CAPACITY - 1};
    expect(sut.top()).toEqual(sampleData1);
    sut.push(sampleData2);
    expect(sut.top()).toEqual(sampleData2);
})

test('Sorted DataWell will keep newer data on merge with old data when processing data with same sortOnProperty', () => {
    sut.push(maxData());
    expect(sut.top()).toEqual(singleData(CAPACITY - 1));
    const sampleData1 = {...singleData(CAPACITY), uniqueData: CAPACITY - 1, data: CAPACITY};
    sut.push(sampleData1);
    expect(sut.top()).toEqual(sampleData1);

    const sampleData2 = {...singleData(CAPACITY), data: CAPACITY + 1, otherData: CAPACITY + 1};
    sut.push(sampleData2);

    const expectedData = {...singleData(CAPACITY), uniqueData: CAPACITY - 1, data: CAPACITY + 1, otherData: CAPACITY + 1};
    expect(sut.top()).toEqual(expectedData);
})

/*
 * Test Top Function
 */

test('DataWell.top will return top element and keep it on stack', () => {
    sut.push(maxData());
    expect(sut.count()).toBe(CAPACITY);
    expect(sut.top()[SORT_ON_PROPERTY]).toBe(CAPACITY - 1);
    expect(sut.count()).toBe(CAPACITY);
    expect(sut.top()[SORT_ON_PROPERTY]).toBe(CAPACITY - 1);
})

test('Unsorted DataWell.top will return last added element', () => {
    let noSortSut = new DataWell(CAPACITY);
    noSortSut.push(maxData());
    const lastdata = singleData(4, 4.1);
    noSortSut.push(lastdata);
    expect(noSortSut.count()).toBe(CAPACITY);
    expect(noSortSut.top()).toEqual(lastdata);
    noSortSut = null;
})

/*
 * Test Content Function
 */

test('DataWell.content will return a list of data items', () => {
    const testData = maxData();
    sut.push(testData);

    expect(sut.count()).toBe(CAPACITY);
    expect(sut.content()).toEqual(testData);
})

