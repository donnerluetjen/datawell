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

test("DataWell capacity returns the capacity", () => {
    expect(sut.capacity()).toBe(CAPACITY);
})

test("DataWell is empty upon creation", () => {
    expect(sut.count()).toBe(0);
});

test('DataWell.isEmpty returns true if empty', () => {
    expect(sut.isEmpty()).toBeTruthy();
})

test('DataWell.isEmpty returns false if not empty', () => {
    sut.push([{data: 1, timestamp: 1}]);
    expect(sut.isEmpty()).toBeFalsy();
})

test('DataWell.isEmpty returns false if full', () => {
    for (let i = 0; i < 11; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
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
    for (let i = 0; i < 11; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    expect(sut.isFull()).toBeTruthy();
})

test('DataWell to contain one item when one item was pushed', () => {
    sut.push([{data: 1, timestamp: 1}]);
    expect(sut.count()).toBe(1);
});

test('DataWell to accept a list of items for push', () => {
    const pushList = [];
    for (let i = 0; i < 8; i++) {
        pushList.push({sample: i, timestamp: i});
    }
    sut.push(pushList);
    expect(sut.count()).toBe(8);
});

test('DataWell will only hold <capacity> elements', () => {
    for (let i = 0; i < 11; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    expect(sut.count()).toBe(10);
})

test('DataWell will only hold last <capacity> elements pushed', () => {
    for (let i = 0; i < 11; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    expect(sut.top()[SORT_ON_ATTRIBUTE]).toBe(10);
})

test('DataWell.top will return top element and keep it on stack', () => {
    for (let i = 0; i < 11; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    expect(sut.top()[SORT_ON_ATTRIBUTE]).toBe(10);
    expect(sut.count()).toBe(10);
})

test('DataWell will override data with same timestamp', () => {
    for (let i = 0; i < 9; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    sut.push([{sample: 8.1, timestamp: 8}]);
    expect(sut.count()).toBe(9);
    expect(sut.top()).toEqual({sample: 8.1, timestamp: 8});
})

test('DataWell will position higher id to top of stack', () => {
    sut.push([{sample: 8, timestamp: 8}]);
    for (let i = 0; i < 8; i++) {
        sut.push([{sample: i, timestamp: i}]);
    }
    expect(sut.count()).toBe(9);
    expect(sut.top()).toEqual({sample: 8, timestamp: 8});
})

test('DataWell.content will return a list of data items', () => {
    let testData = new Array(CAPACITY);
    for (let i = 0; i < CAPACITY; i++) {
        testData[i] = {'timestamp': i, 'close': i};
    }

    sut.push(testData);

    expect(sut.count()).toBe(10);
    expect(sut.content()).toEqual(testData);
})

test('DataWell.top will return last added element if sorted is false', () => {
    let noSortSut = new DataWell(CAPACITY);
    for (let i = 0; i < 9; i++) {
        noSortSut.push([{sample: i, timestamp: i}]);
    }
    noSortSut.push([{sample: 4.1, timestamp: 4}]);
    expect(noSortSut.count()).toBe(10);
    expect(noSortSut.top()).toEqual({sample: 4.1, timestamp: 4});
    noSortSut = null;
})

test('DataWell will throw an error if it is to be sorted and the attribute to be sorted on does not exist', () => {
    expect(() => {
        sut.push([{sample: 1, not_a_timestamp: 1}]);
    }).toThrow('Supplied data in element 0 does not contain the attribute timestamp, which you defined to sort on.');
})

test('DataWell will throw an error if it is to be sorted and the attribute to be sorted on is not a of type number', () => {
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

