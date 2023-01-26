# DataWell

Creates and maintaines a stack of data to refer to.

## Requirements and Feature

### Sorted DataWell

- A sorted DataWell will always be sorted ascending and has the following requirements and features:

  - The property to sort on must be of type number.
  - The property to sort on must be present.
  - The property to sort on can be specified, the default is "id".
  - Exisitng data with the same property to sort on will be updated, same properties will be overriden, different properties will be merged.

### Unsorted DataWell

- An unsorted DataWell will never be sorted. It will always push added data to the top of the DataWell.

### Common Features

- The DataWell has a maximum capacity that has to be set during initialization.
- When the DataWell is about to exceed its capacity, data from the bottom will silently be removed.
- Data cannot be deleted manually.
- Data can be pushed to the DataWell as a list or as a single object.

## Examples

### Unsorted DataWell

```
const dataWell = new DataWell(4);

for (let i=0; i < 4; i++) {
  dataWell.push({sample: i};
}
  
dataWell.push([{sample: -4}]);
console.log(dataWell.content();

/*
produces:
[
{ sample: 1 },
{ sample: 2 },
{ sample: 3 },
{ sample: -4}
]
*/
```

### Sorted DataWell

```
const dataWell = new DataWell(4, true);

for (let i=0; i < 4; i++) {
  dataWell.push({sample: i, id: i};
}
  
dataWell.push([{sample: -4, id: 1}]);
console.log(dataWell.content();

/*
produces:
[
{ sample: 0, id: 0 },
{ sample: -4, id: 1 },
{ sample: 2, id: 2 },
{ sample: 3, id: 3 }
]
*/
```

or, with your own property to sort on:

```
const dataWell = new DataWell(4, true, "sortOn");

for (let i=0; i < 4; i++) {
  dataWell.push({sample: i, sortOn: i};
}
  
dataWell.push([{sample: -4, otherData: 42, sortOn: 1}]);
console.log(dataWell.content();

/*
produces:
[
{ sample: 0, sortOn: 0 },
{ sample: -4, otherData: 42, sortOn: 1 },
{ sample: 2, sortOn: 2 },
{ sample: 3, sortOn: 3 }
]
*/
```

## Bugs and Feature Requests

Please open an issue here: https://github.com/donnerluetjen/datawell/issues
