# dataloader-toolbox

## api

### createDataLoaderSession

create a session and add to context when you create new context(per request).
session function returns dataloader function from general function.

#### code

```ts
const session = createDataLoaderSession()
const getData = (keys: string[]) => {
  // find data keys: ['key1', 'key2', 'key3']

  return [...data]
}

async function resolver(parent, args, context) {
  context.session(getData).load('key1')
  context.session(getData).load('key2')
  context.session(getData).load('key3')
}
```

### dataLoaderSorter

`dataloader` does not support sorting, so you need to sorter

#### code

```ts
const session = createDataLoaderSession()
const getData = (keys: string[]) => {
  type Item = {
    id: string
  }

  const sql = `
select *
from table
where id in (${keys})`
  
  // query returns Promise<Item[]>
  return query(sql).then(dataLoaderSorter<Item, 'id'>(keys, 'id'))
}
```

## license
MIT
