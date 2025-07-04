const supertest = require('supertest')
const express = require('express')
const { field, validateInput } = require('../validator')
const { setFieldValue, runValidation } = require('../validator/input')
const { sanitizeValue } = require('../validator/field')
const {
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
} = require('./helpers/mockData')

const exampleValidator = [
  field('name').isString().length({ min: 3, max: 30 }).sanitize(),
  field('email').isEmail().length({ min: 5, max: 50 }).sanitize(),
  field('age').isNumber().range({ min: 18, max: 99 }).optional(),
  field('role').enum(['admin', 'user']).optional(),
  field('flag').isBoolean().optional(),
  field('customField').custom(value => (value === 'pass' ? true : 'fail')).optional(),
  field('file').isFile().optional(),
  field('list').isArray().optional(),
  field('obj').isObject().optional()
]

// -------------------- Middleware: validateInput --------------------
describe('Middleware: validateInput', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use((req, res, next) => {
      res.api = (statusKey, data = {}, message = '') => {
        if (statusKey === 'success') {
          return res.status(200).json({
            status: 200,
            message,
            data,
            trace: {
              method: req.method,
              path: req.originalUrl,
              timestamp: new Date().toISOString(),
              responseTime: '0.1ms',
              hash: 'dummyhash'
            }
          })
        }
        if (statusKey === 'validation_error') {
          return res.status(422).json({
            status: 422,
            type: `http://localhost:3000/errors/validation_error`,
            title: 'Validation Failed',
            detail: 'Input validation failed.',
            solution: 'Please check and correct all required fields.',
            instance: req.originalUrl,
            errors: data || [],
            trace: {
              method: req.method,
              path: req.originalUrl,
              timestamp: new Date().toISOString(),
              responseTime: '0.1ms',
              hash: 'dummyhash'
            }
          })
        }
        return res.status(500).json({ status: 500, message: 'Internal Server Error' })
      }
      next()
    })
    app.post('/test', validateInput(exampleValidator), (req, res) => {
      res.api('success', req.body, 'Authorized')
    })
  })

  describe('Validation scenarios', () => {
    it('rejects missing required fields', async () => {
      const res = await supertest(app).post('/test').send({})
      expect(res.status).toBe(422)
      expect(res.body.title).toBe('Validation Failed')
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Field Is Required' }),
          expect.objectContaining({ field: 'email', message: 'Field Is Required' })
        ])
      )
    })

    it('accepts valid input', async () => {
      const res = await supertest(app).post('/test').send(exampleValidInput)
      expect(res.status).toBe(200)
      expect(res.body.status).toBe(200)
      expect(res.body.message).toBe('Authorized')
      expect(res.body.data.name).toBe(exampleValidInput.name)
      expect(res.body.data.email).toBe(exampleValidInput.email)
    })

    it('rejects invalid email format', async () => {
      const res = await supertest(app).post('/test').send(exampleInvalidEmailInput)
      expect(res.status).toBe(422)
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email', message: 'Invalid Email' })
        ])
      )
    })

    it('rejects string length too long', async () => {
      const longName = 'a'.repeat(31333) // 31 karakter, melebihi max 30
      const res = await supertest(app).post('/test').send({
        name: longName,
        email: 'valid@example.com'
      })
      expect(res.status).toBe(422)
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Length Too Long' })
        ])
      )
    })

    it('resolves value from query when single value (not array)', () => {
      const inputData = {
        body: {},
        query: { foo: 'bar' },
        params: {},
        files: {},
        rawBody: null
      }
      const rules = [field('foo').isString()]
      const errors = runValidation(inputData, rules)
      expect(errors.length).toBe(0)
    })

    it('resolves value from params correctly', () => {
      const inputData = {
        body: {},
        query: {},
        params: { userId: '12345' },
        files: {},
        rawBody: null
      }
      const rules = [field('userId').isString()]
      const errors = runValidation(inputData, rules)
      expect(errors.length).toBe(0)
    })


    it('rejects string length too short', async () => {
      const res = await supertest(app).post('/test').send(exampleShortNameInput)
      expect(res.status).toBe(422)
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Length Too Short' })
        ])
      )
    })

    it('sanitizes input properly', async () => {
      const res = await supertest(app).post('/test').send(exampleSanitizeInput)
      expect(res.status).toBe(200)
      expect(res.body.data.name).not.toContain('<script>')
      expect(res.body.data.name).not.toContain('alert')
      expect(res.body.data.email).toBe(exampleSanitizeInput.email.trim())
    })

    it('detects duplicate body parameter', () => {
      const input = { body: { foo: 1 }, query: {}, params: {}, files: {}, rawBody: exampleDuplicateBodyRaw }
      const result = runValidation(input, [field('foo').isNumber()])
      expect(result).toEqual(
        expect.arrayContaining([{ field: 'foo', message: 'Duplicate Body Parameter' }])
      )
    })

    it('detects duplicate query parameter', () => {
      const result = runValidation(exampleDuplicateQueryInput, [field('foo').isString()])
      expect(result).toEqual(
        expect.arrayContaining([{ field: 'foo', message: 'Duplicate Query Parameter' }])
      )
    })
  })

  it('middleware catches thrown error and returns config error', () => {
    const badMiddleware = () => {
      throw new Error('Forced error')
    }
    const validateInput = require('../validator/input').validateInput
    // call middleware factory with bad function to simulate error
    const mw = validateInput(() => { throw new Error() })
    // Can't easily test async middleware catch, so just ensure no crash by calling with mock req/res/next
    const req = {}
    const res = {
      api: jest.fn()
    }
    const next = jest.fn()
    mw(req, res, next)
    expect(res.api).toHaveBeenCalledWith(
      'validation_error',
      expect.arrayContaining([{ field: '_config', message: 'Validator FieldRules Invalid Or Missing' }])
    )
  })
})

// -------------------- Field Builder --------------------
describe('field builder', () => {
  it('should create field with default values', () => {
    const f = field('testField')
    expect(f.fieldName).toBe('testField')
    expect(f.type).toBeNull()
    expect(f.isOptional).toBe(false)
    expect(f.lengthRules).toBeNull()
    expect(f.rangeRules).toBeNull()
    expect(f.enumValues).toBeNull()
    expect(f.regexPattern).toBeNull()
    expect(f.customRules).toEqual([])
    expect(f.enableSanitize).toBe(false)
  })

  it('should set type using chaining methods', () => {
    const types = ['String', 'Number', 'Boolean', 'Email', 'File', 'Array', 'Object']
    types.forEach(typeName => {
      const f = field('x')[`is${typeName}`]()
      expect(f.type).toBe(typeName.toLowerCase())
    })
  })

  it('should set length rules correctly', () => {
    const f = field('len').length({ min: 1, max: 10 })
    expect(f.lengthRules).toEqual({ min: 1, max: 10 })
  })

  it('should ignore invalid length rules', () => {
    const f = field('len').length({ min: 'a', max: null })
    expect(f.lengthRules).toEqual({ min: null, max: null })
  })

  it('should set range rules correctly', () => {
    const f = field('range').range({ min: 5, max: 20 })
    expect(f.rangeRules).toEqual({ min: 5, max: 20 })
  })

  it('should ignore invalid range rules', () => {
    const f = field('range').range({ min: 'x', max: 'y' })
    expect(f.rangeRules).toEqual({ min: null, max: null })
  })

  it('should set enum values when array', () => {
    const f = field('enum').enum(['a', 'b'])
    expect(f.enumValues).toEqual(['a', 'b'])
  })

  it('should ignore enum values if not array', () => {
    const f = field('enum').enum('string')
    expect(f.enumValues).toBeNull()
  })

  it('should set regex pattern if RegExp', () => {
    const regex = /^[a-z]+$/
    const f = field('pat').pattern(regex)
    expect(f.regexPattern).toBe(regex)
  })

  it('should ignore regex if not RegExp', () => {
    const f = field('pat').pattern('string')
    expect(f.regexPattern).toBeNull()
  })

  it('should add custom rule if function', () => {
    const fn = val => true
    const f = field('custom').custom(fn)
    expect(f.customRules.length).toBe(1)
    expect(f.customRules[0]).toBe(fn)
  })

  it('should ignore custom rule if not function', () => {
    const f = field('custom').custom('string')
    expect(f.customRules.length).toBe(0)
  })

  it('should mark optional correctly', () => {
    const f = field('opt').optional()
    expect(f.isOptional).toBe(true)
  })

  it('should enable sanitize correctly', () => {
    const f = field('san').sanitize()
    expect(f.enableSanitize).toBe(true)
  })
})

// -------------------- Sanitization --------------------
describe('sanitizeValue function', () => {
  it('returns non-string values unchanged', () => {
    expect(sanitizeValue(123)).toBe(123)
    expect(sanitizeValue(null)).toBeNull()
    expect(sanitizeValue(undefined)).toBeUndefined()
    expect(sanitizeValue({})).toEqual({})
  })

  it('escapes HTML special characters', () => {
    const input = `<div class="test">Hello & 'world'</div>`
    const expected = `&lt;div class=&quot;test&quot;&gt;Hello &amp; &#x27;world&#x27;&lt;&#x2F;div&gt;`
    expect(sanitizeValue(input)).toBe(expected)
  })

  it('removes event handlers like onclick', () => {
    const input = `<a href="#" onclick="alert('XSS')">Click me</a>`
    const sanitized = sanitizeValue(input)
    expect(sanitized).not.toMatch(/onclick=/i)
    expect(sanitized).not.toMatch(/alert/i)
  })

  it('removes dangerous protocols', () => {
    const input = `<a href="javascript:alert('XSS')">Bad Link</a>`
    const sanitized = sanitizeValue(input)
    expect(sanitized).not.toContain('javascript:')
    expect(sanitized).not.toContain('alert')
  })

  it('removes script and iframe tags', () => {
    const input = `<script>alert('XSS')</script><div>Safe</div><iframe></iframe>`
    const sanitized = sanitizeValue(input)
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('<iframe>')
    expect(sanitized).toContain('&lt;div&gt;Safe&lt;&#x2F;div&gt;')
  })

  it('removes img, svg, object, embed, link, meta tags', () => {
    const tags = ['img', 'svg', 'object', 'embed', 'link', 'meta']
    tags.forEach(tag => {
      const input = `<${tag}>bad content</${tag}>`
      const sanitized = sanitizeValue(input)
      expect(sanitized).not.toContain(`<${tag}>`)
    })
  })

  it('removes inline styles', () => {
    const input = `<div style="color:red">Text</div>`
    const sanitized = sanitizeValue(input)
    expect(sanitized).not.toMatch(/style=/i)
    expect(sanitized).toContain('&lt;div')
  })

  it('removes complex inline event handlers and scripts', () => {
    const input = `<div onclick="alert('XSS')" style="color:red" onmouseover="evil()">Test<script>evil()</script></div>`
    const sanitized = sanitizeValue(input)
    expect(sanitized).not.toMatch(/onclick=/i)
    expect(sanitized).not.toMatch(/onmouseover=/i)
    expect(sanitized).not.toMatch(/style=/i)
    expect(sanitized).not.toMatch(/<script>/i)
    expect(sanitized).toContain('&lt;div')
  })

  it('returns non-string unchanged', () => {
    expect(sanitizeValue(123)).toBe(123)
    expect(sanitizeValue(null)).toBeNull()
    expect(sanitizeValue(undefined)).toBeUndefined()
    expect(sanitizeValue({})).toEqual({})
  })

  it('trims string and replaces special characters', () => {
    const input = `  <div>"Test"&'/'&  `
    const output = sanitizeValue(input)
    expect(output).toContain('&lt;div&gt;')
    expect(output).toContain('&quot;')
    expect(output).toContain('&amp;')
    expect(output).toContain('&#x27;')
    expect(output).toContain('&#x2F;')
  })

  it('removes dangerous tags and their closing tags', () => {
    const tags = ['script', 'iframe', 'img', 'svg', 'object', 'embed', 'link', 'meta']
    tags.forEach(tag => {
      const input = `<${tag} someattr>danger</${tag}>`
      const output = sanitizeValue(input)
      expect(output).not.toContain(`<${tag}`)
      expect(output).not.toContain('danger')
    })
  })


  it('removes inline event handlers and styles', () => {
    const input = `<div onclick="evil()" onmouseover='bad()' style="color:red" style='font-weight:bold'>content</div>`
    const output = sanitizeValue(input)
    expect(output).not.toMatch(/on\w+=/)
    expect(output).not.toMatch(/style=/)
    expect(output).toContain('&lt;div')
  })

  it('removes dangerous protocols', () => {
    const input = `<a href="javascript:alert(1)">click</a><a href="vbscript:bad">bad</a><a href="data:text/html">data</a>`
    const output = sanitizeValue(input)
    expect(output).not.toContain('javascript:')
    expect(output).not.toContain('vbscript:')
    expect(output).not.toContain('data:')
  })

  it('removes javascript alert, eval, expression', () => {
    const input = `alert('xss') eval('xss') expression('xss')`
    const output = sanitizeValue(input)
    expect(output).not.toContain('alert(')
    expect(output).not.toContain('eval(')
    expect(output).not.toContain('expression(')
  })
})

// -------------------- runValidation --------------------
describe('runValidation', () => {
  it('returns error if no rules provided', () => {
    const result = runValidation({ body: {}, query: {}, params: {}, files: {}, rawBody: null }, null)
    expect(result).toEqual([
      { field: '_config', message: 'Validator FieldRules Invalid Or Missing' }
    ])
  })

  it('returns error if rule invalid', () => {
    const result = runValidation({ body: {}, query: {}, params: {}, files: {}, rawBody: null }, [{}])
    expect(result).toEqual([
      { field: '_config', message: 'Invalid Rule Detected' }
    ])
  })

  it('validates custom rule failure', () => {
    const rule = field('test').custom(val => val === 'ok' ? true : 'failed')
    const result = runValidation(
      { body: { test: 'no' }, query: {}, params: {}, files: {}, rawBody: null },
      [rule]
    )
    expect(result).toEqual([
      { field: 'test', message: 'failed' }
    ])
  })

  it('rejects boolean with invalid values', () => {
    const rule = field('flag').isBoolean()
    const errors = runValidation(
      { body: { flag: 'notboolean' }, query: {}, params: {}, files: {}, rawBody: null },
      [rule]
    )
    expect(errors).toEqual([
      expect.objectContaining({ field: 'flag', message: 'Must Be Boolean' })
    ])
  })

  it('rejects file without originalname', () => {
    const rule = field('file').isFile()
    const errors = runValidation(
      { body: {}, query: {}, params: {}, files: { file: {} }, rawBody: null },
      [rule]
    )
    expect(errors).toEqual([
      expect.objectContaining({ field: 'file', message: 'Invalid File' })
    ])
  })

  it('rejects array if not array', () => {
    const rule = field('list').isArray()
    const errors = runValidation(
      { body: { list: 'notarray' }, query: {}, params: {}, files: {}, rawBody: null },
      [rule]
    )
    expect(errors).toEqual([
      expect.objectContaining({ field: 'list', message: 'Must Be Array' })
    ])
  })

  it('rejects object if not object', () => {
    const rule = field('obj').isObject()
    const errors = runValidation(
      { body: { obj: 'notobject' }, query: {}, params: {}, files: {}, rawBody: null },
      [rule]
    )
    expect(errors).toEqual([
      expect.objectContaining({ field: 'obj', message: 'Must Be Object' })
    ])
  })

  it('returns no error for optional field with undefined value', () => {
    const rules = [field('optionalField').isString().optional()]
    const result = runValidation({ body: {}, query: {}, params: {}, files: {}, rawBody: null }, rules)
    expect(result).toHaveLength(0)
  })

  it('sanitizes value and sets field correctly', () => {
    const inputData = { body: { name: '<script>alert(1)</script>John' }, query: {}, params: {}, files: {}, rawBody: null }
    const rules = [field('name').isString().sanitize()]
    const result = runValidation(inputData, rules)
    expect(result).toHaveLength(0)
    expect(inputData.body.name).not.toContain('<script>')
  })

  it('setFieldValue updates body, query, and params', () => {
    const inputData = {
      body: { a: 1 },
      query: { b: 2 },
      params: { c: 3 },
      files: {},
      rawBody: null
    }
    setFieldValue(inputData, 'a', 10)
    setFieldValue(inputData, 'b', 20)
    setFieldValue(inputData, 'c', 30)
    expect(inputData.body.a).toBe(10)
    expect(inputData.query.b).toBe(20)
    expect(inputData.params.c).toBe(30)
  })

  it('handles unexpected fieldRules types gracefully', () => {
    const inputData = { body: {}, query: {}, params: {}, files: {}, rawBody: null }
    const invalidRules = [null, {}, { fieldName: null }, { fieldName: '' }]
    const result = runValidation(inputData, invalidRules)
    expect(result).toEqual(
      expect.arrayContaining([{ field: '_config', message: 'Invalid Rule Detected' }])
    )
  })

  it('validates enum with invalid values', () => {
    const rule = field('role').enum(['admin', 'user'])
    const inputData = { body: { role: 'guest' }, query: {}, params: {}, files: {}, rawBody: null }
    const errors = runValidation(inputData, [rule])
    expect(errors).toEqual(
      expect.arrayContaining([{ field: 'role', message: 'Invalid Value' }])
    )
  })

  it('runs custom rules and detects failures', () => {
    const rule = field('custom').custom(val => val === 'pass' ? true : 'fail')
    const inputData = { body: { custom: 'fail' }, query: {}, params: {}, files: {}, rawBody: null }
    const errors = runValidation(inputData, [rule])
    expect(errors).toEqual(
      expect.arrayContaining([{ field: 'custom', message: 'fail' }])
    )
  })

  it('handles edge case of empty fieldRules array', () => {
    const result = runValidation({ body: {}, query: {}, params: {}, files: {}, rawBody: null }, [])
    expect(result).toEqual([
      { field: '_config', message: 'Validator FieldRules Invalid Or Missing' }
    ])
  })

  it('detects invalid singleRule objects', () => {
    const inputData = { body: {}, query: {}, params: {}, files: {}, rawBody: null }
    const invalidRules = [null, {}, { fieldName: null }, { fieldName: '' }]
    const result = runValidation(inputData, invalidRules)
    expect(result).toEqual(
      expect.arrayContaining([{ field: '_config', message: 'Invalid Rule Detected' }])
    )
  })

  it('checks numeric range boundaries properly', () => {
    const rule = field('num').isNumber().range({ min: 10, max: 20 })
    const inputDataLow = { body: { num: 5 }, query: {}, params: {}, files: {}, rawBody: null }
    const inputDataHigh = { body: { num: 25 }, query: {}, params: {}, files: {}, rawBody: null }
    expect(runValidation(inputDataLow, [rule])).toEqual(
      expect.arrayContaining([{ field: 'num', message: 'Number Too Small' }])
    )
    expect(runValidation(inputDataHigh, [rule])).toEqual(
      expect.arrayContaining([{ field: 'num', message: 'Number Too Large' }])
    )
  })

  it('validates regex pattern mismatch', () => {
    const rule = field('code').isString().pattern(/^ABC\d{3}$/)
    const inputData = { body: { code: 'XYZ123' }, query: {}, params: {}, files: {}, rawBody: null }
    expect(runValidation(inputData, [rule])).toEqual(
      expect.arrayContaining([{ field: 'code', message: 'Pattern Mismatch' }])
    )
  })

  it('sets field value correctly when sanitizing', () => {
    const inputData = { body: { text: '<script>bad</script>' }, query: {}, params: {}, files: {}, rawBody: null }
    const rule = field('text').isString().sanitize()
    const errors = runValidation(inputData, [rule])
    expect(errors.length).toBe(1)
    expect(inputData.body.text).not.toContain('<script>')
  })

  it('rejects wrong type for string and number', () => {
    const stringRule = field('str').isString()
    const numberRule = field('num').isNumber()
    const inputData = { body: { str: 123, num: 'abc' }, query: {}, params: {}, files: {}, rawBody: null }
    const errors = runValidation(inputData, [stringRule, numberRule])
    expect(errors).toEqual(
      expect.arrayContaining([
        { field: 'str', message: 'Must Be String' },
        { field: 'num', message: 'Must Be Number' }
      ])
    )
  })

  it('rejects invalid boolean values', () => {
    const rule = field('flag').isBoolean()
    const inputData = { body: { flag: 'notbool' }, query: {}, params: {}, files: {}, rawBody: null }
    const errors = runValidation(inputData, [rule])
    expect(errors).toEqual(
      expect.arrayContaining([{ field: 'flag', message: 'Must Be Boolean' }])
    )
  })

  it('rejects invalid file object', () => {
    const rule = field('file').isFile()
    const inputData = { body: {}, query: {}, params: {}, files: { file: {} }, rawBody: null }
    const errors = runValidation(inputData, [rule])
    expect(errors).toEqual(
      expect.arrayContaining([{ field: 'file', message: 'Invalid File' }])
    )
  })

  it('rejects non-array for array type', () => {
    const rule = field('list').isArray()
    const inputData = { body: { list: 'notarray' }, query: {}, params: {}, files: {}, rawBody: null }
    const errors = runValidation(inputData, [rule])
    expect(errors).toEqual(
      expect.arrayContaining([{ field: 'list', message: 'Must Be Array' }])
    )
  })

  it('rejects non-object for object type', () => {
    const rule = field('obj').isObject()
    const inputData = { body: { obj: 'notobject' }, query: {}, params: {}, files: {}, rawBody: null }
    const errors = runValidation(inputData, [rule])
    expect(errors).toEqual(
      expect.arrayContaining([{ field: 'obj', message: 'Must Be Object' }])
    )
  })

  it('tests setFieldValue on all containers', () => {
    const inputData = {
      body: { a: 1 },
      query: { b: 2 },
      params: { c: 3 },
      files: {},
      rawBody: null
    }
    setFieldValue(inputData, 'a', 10)
    setFieldValue(inputData, 'b', 20)
    setFieldValue(inputData, 'c', 30)
    expect(inputData.body.a).toBe(10)
    expect(inputData.query.b).toBe(20)
    expect(inputData.params.c).toBe(30)
  })
})

// -------------------- setFieldValue --------------------
describe('setFieldValue', () => {
  it('updates body property', () => {
    const inputData = { body: { a: 1 }, query: {}, params: {}, files: {}, rawBody: null }
    setFieldValue(inputData, 'a', 42)
    expect(inputData.body.a).toBe(42)
  })
  it('updates query property', () => {
    const inputData = { body: {}, query: { b: 2 }, params: {}, files: {}, rawBody: null }
    setFieldValue(inputData, 'b', 99)
    expect(inputData.query.b).toBe(99)
  })
  it('updates params property', () => {
    const inputData = { body: {}, query: {}, params: { c: 3 }, files: {}, rawBody: null }
    setFieldValue(inputData, 'c', 123)
    expect(inputData.params.c).toBe(123)
  })
  it('does nothing if field not found', () => {
    const inputData = { body: {}, query: {}, params: {}, files: {}, rawBody: null }
    setFieldValue(inputData, 'nonexistent', 'value')
    expect(inputData.body).toEqual({})
    expect(inputData.query).toEqual({})
    expect(inputData.params).toEqual({})
  })
  it('updates field in body', () => {
    const inputData = { body: { a: 1 }, query: {}, params: {}, files: {}, rawBody: null }
    setFieldValue(inputData, 'a', 42)
    expect(inputData.body.a).toBe(42)
  })
  it('updates field in query', () => {
    const inputData = { body: {}, query: { b: 2 }, params: {}, files: {}, rawBody: null }
    setFieldValue(inputData, 'b', 99)
    expect(inputData.query.b).toBe(99)
  })
  it('updates field in params', () => {
    const inputData = { body: {}, query: {}, params: { c: 3 }, files: {}, rawBody: null }
    setFieldValue(inputData, 'c', 123)
    expect(inputData.params.c).toBe(123)
  })
  it('does not update if field not found', () => {
    const inputData = { body: {}, query: {}, params: {}, files: {}, rawBody: null }
    setFieldValue(inputData, 'nonexistent', 'value')
    expect(inputData.body).toEqual({})
    expect(inputData.query).toEqual({})
    expect(inputData.params).toEqual({})
  })
})

// -------------------- Extra/Edge Coverage --------------------
describe('Extra/Edge Coverage', () => {
  test('runValidation returns error if fieldRules invalid (null or empty)', () => {
    const inputData = { body: {}, query: {}, params: {}, files: {}, rawBody: null }
    const errors1 = runValidation(inputData, null)
    const errors2 = runValidation(inputData, [])
    expect(errors1).toEqual(expect.arrayContaining([{ field: '_config', message: 'Validator FieldRules Invalid Or Missing' }]))
    expect(errors2).toEqual(expect.arrayContaining([{ field: '_config', message: 'Validator FieldRules Invalid Or Missing' }]))
  })

  test('runValidation detects invalid rule objects', () => {
    const inputData = { body: {}, query: {}, params: {}, files: {}, rawBody: null }
    const invalidRules = [null, {}, { fieldName: null }, { fieldName: '' }]
    const errors = runValidation(inputData, invalidRules)
    expect(errors).toEqual(expect.arrayContaining([{ field: '_config', message: 'Invalid Rule Detected' }]))
  })
})