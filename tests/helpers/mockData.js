const exampleValidInput = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  role: 'admin',
  flag: true,
  customField: 'pass',
  file: {
    originalname: 'file.txt',
    mimetype: 'text/plain',
    size: 1024
  },
  list: ['item1', 'item2'],
  obj: { key: 'value' }
}

const exampleInvalidEmailInput = {
  ...exampleValidInput,
  email: 'invalid-email'
}

const exampleShortNameInput = {
  ...exampleValidInput,
  name: 'Jo'
}

const exampleSanitizeInput = {
  name: '<script>alert(1)</script>John Doe',
  email: '  john@example.com  '
}

const exampleInvalidBooleanInput = {
  ...exampleValidInput,
  flag: 'notabool'
}

const exampleInvalidFileInput = {
  ...exampleValidInput,
  file: { invalid: 'object' } // no originalname
}

const exampleInvalidArrayInput = {
  ...exampleValidInput,
  list: 'not-an-array'
}

const exampleInvalidObjectInput = {
  ...exampleValidInput,
  obj: 'not-an-object'
}

const exampleDuplicateBodyRaw = '{"foo":1,"foo":2}'

const exampleDuplicateQueryInput = {
  body: {},
  query: { foo: ['bar', 'baz'] },
  params: {},
  files: {},
  rawBody: null
}

module.exports = {
  exampleValidInput,
  exampleInvalidEmailInput,
  exampleShortNameInput,
  exampleSanitizeInput,
  exampleInvalidBooleanInput,
  exampleInvalidFileInput,
  exampleInvalidArrayInput,
  exampleInvalidObjectInput,
  exampleDuplicateBodyRaw,
  exampleDuplicateQueryInput
}