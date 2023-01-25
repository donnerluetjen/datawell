const DataWell = require("./datawell");
let sut = null;
const CAPACITY = 10;
const SORT_ON_ATTRIBUTE = "timestamp";

beforeEach(() => {
     sut = new DataWell(CAPACITY, true, SORT_ON_ATTRIBUTE);
});

afterEach(() => {
    sut = null;
});

/*
 *** THelper Functions ***
 */

const maxData = () => {
    let data = [];
    for (let i = 0; i < CAPACITY; i++) {
        data.push({sample: i, timestamp: i});
    }
    return data;
}

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
    sut.push([{sample: 0, timestamp: 0}]);
    expect(sut.capacity()).toBe(CAPACITY);
    sut.push(maxData());
    expect(sut.capacity()).toBe(CAPACITY);
})

test('DataWell.isEmpty returns true if empty', () => {
    expect(sut.isEmpty()).toBeTruthy();
})

test('DataWell.isEmpty returns false if not empty', () => {
    sut.push([{data: 1, timestamp: 1}]);
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
    sut.push([{data: 1, timestamp: 1}]);
    expect(sut.isFull()).toBeFalsy();
})

test('DataWell.isFull returns true if full', () => {
    sut.push(maxData());
    expect(sut.isFull()).toBeTruthy();
})

/*
 *** Test Push Function ***
 */

test('Sorted DataWell to contain one item when one item was pushed', () => {
    sut.push([{data: 1, timestamp: 1}]);
    expect(sut.count()).toBe(1);
});

test('Sorted DataWell to accept a list of items for push', () => {
    sut.push(maxData());
    expect(sut.isFull()).toBeTruthy();
});

test('DataWell will only hold CAPACITY elements', () => {
    sut.push(maxData());
    sut.push([{sample: CAPACITY + 1, timestamp: CAPACITY + 1}]);
    expect(sut.count()).toBe(CAPACITY);
})

test('Sorted DataWell will only hold highest CAPACITY elements pushed', () => {
    sut.push([{sample: CAPACITY + 1, timestamp: CAPACITY + 1}]);
    sut.push(maxData());
    expect(sut.top()[SORT_ON_ATTRIBUTE]).toBe(CAPACITY - 1);
})

test('Sorted DataWell will position higher id to top of stack', () => {
    sut.push([{sample: 8, timestamp: 8}]);
    for (let i = 0; i < 8; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    expect(sut.count()).toBe(9);
    expect(sut.top()).toEqual({sample: 8, timestamp: 8});
})

test('Sorted DataWell will override data with same timestamp', () => {
    for (let i = 0; i < 9; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    sut.push([{sample: 8.1, timestamp: 8}]);
    expect(sut.count()).toBe(9);
    expect(sut.top()).toEqual({sample: 8.1, timestamp: 8});
})

test('Unsorted DataWell will push data with same timestamp to top', () => {
    let noSortSut = new DataWell(CAPACITY, false, 'timestamp');
    noSortSut.push(maxData());
    noSortSut.push([{sample: 0, timestamp: 0}]);
    expect(noSortSut.top()).toEqual({sample: 0, timestamp: 0});
})

test('Sorted DataWell will throw an error if the attribute to be sorted on does not exist', () => {
    expect(() => {
        sut.push([{sample: 1, not_a_timestamp: 1}]);
    }).toThrow('Supplied data in element 0 does not contain the attribute timestamp, which you defined to sort on.');
})

test('Unsorted DataWell does not throw an error if the attribute to be sorted on does not exist', () => {
    let noSortSut = new DataWell(CAPACITY, false, 'timestamp');
    expect(() => {
        noSortSut.push([{sample: 1, id: 1}]);
    }).not.toThrow('Supplied data in element 0 does not contain the attribute timestamp, which you defined to sort on.');
})

test('Sorted DataWell will throw an error if the attribute to be sorted on is not a of type number', () => {
    expect(() => {
        sut.push([{sample: 1, timestamp: '1'}]);
    }).toThrow('Supplied data attribute timestamp to sort on in element 0 is not a number.');
    data = [
        {sample: 0, timestamp: 0},
        {sample: 1, timestamp: true}
    ];
    expect(() => {
        sut.push(data);
    }).toThrow('Supplied data attribute timestamp to sort on in element 1 is not a number.');
})

test('Unsorted DataWell does not throw an error if the attribute to be sorted on is not a of type number', () => {
    let noSortSut = new DataWell(CAPACITY, false, 'timestamp');
    expect(() => {
        noSortSut.push([{sample: 1, timestamp: '1'}]);
    }).not.toThrow('Supplied data attribute timestamp to sort on in element 0 is not a number.');
})

test('Sorted DataWell will merge new data with old data when processing data with same sortOnAttribute', () => {
    sut.push(maxData());
    expect(sut.top()).toEqual({sample: CAPACITY - 1, timestamp: CAPACITY - 1});
    sut.push([{sample: CAPACITY - 1, timestamp: CAPACITY - 1, otherData: CAPACITY - 1}]);
    expect(sut.top()).toEqual({sample: CAPACITY - 1, timestamp: CAPACITY - 1, otherData: CAPACITY - 1});
})

test('Sorted DataWell will keep newer data on merge with old data when processing data with same sortOnAttribute', () => {
    sut.push(maxData());
    expect(sut.top()).toEqual({sample: CAPACITY - 1, timestamp: CAPACITY - 1});
    sut.push([{timestamp: CAPACITY - 1, otherData: CAPACITY - 1}]);
    expect(sut.top()).toEqual({sample: CAPACITY - 1, timestamp: CAPACITY - 1, otherData: CAPACITY - 1});
})

/*
 * Test Top Function
 */

test('DataWell.top will return top element and keep it on stack', () => {
    sut.push(maxData());
    expect(sut.count()).toBe(CAPACITY);
    expect(sut.top()[SORT_ON_ATTRIBUTE]).toBe(CAPACITY - 1);
    expect(sut.count()).toBe(CAPACITY);
    expect(sut.top()[SORT_ON_ATTRIBUTE]).toBe(CAPACITY - 1);
})

test('Unsorted DataWell.top will return last added element', () => {
    let noSortSut = new DataWell(CAPACITY);
    noSortSut.push(maxData());
    noSortSut.push([{sample: 4.1, timestamp: 4}]);
    expect(noSortSut.count()).toBe(CAPACITY);
    expect(noSortSut.top()).toEqual({sample: 4.1, timestamp: 4});
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

