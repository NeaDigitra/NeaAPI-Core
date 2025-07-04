# 🧰 Validator — Usage & Reference

The validator module gives you robust, readable, and chainable field validation for any Express route, with built-in sanitization, type check, pattern, enum, custom, and more.

---

## 📦 Supported Validation Rules

* `isString()` — String type only
* `isNumber()` — Number type only
* `isBoolean()` — Boolean (true/false, 1/0, 'true'/'false')
* `isEmail()` — Must be valid email address
* `isFile()` — File upload object (with `originalname`)
* `isArray()` — Array only
* `isObject()` — Object (not array)
* `length({ min, max })` — String/email length
* `range({ min, max })` — Number range
* `enum(['A','B'])` — Value must match one of allowed
* `pattern(/regex/)` — Regex match
* `custom(fn)` — Custom validation logic, return true or message
* `optional()` — Field not required
* `sanitize()` — Block XSS, auto-escape, remove dangerous input

---

## 🚦 Usage Example

**In a route:**

```js
const { field, validateInput } = require('../validator')

const validator = [
  field('username').isString().length({ min: 4, max: 20 }).sanitize(),
  field('email').isEmail().length({ min: 8, max: 40 }).sanitize(),
  field('age').isNumber().range({ min: 18, max: 60 }).optional(),
  field('role').enum(['admin', 'user']).optional(),
  field('about').optional(),
  field('flag').isBoolean().optional(),
  field('avatar').isFile().optional(),
  field('password').custom(val => val && val.length >= 8 ? true : 'Min 8 chars')
]

router.post('/signup', validateInput(validator), controller.signup)
```

---

## 🧪 Error Handling

* If validation fails, response is:

  ```json
  {
    ...
    "errors": [
      { "field": "username", "message": "Field Is Required" },
      { "field": "email", "message": "Invalid Email" }
    ]
  }
  ```
* All error messages are RFC7807 compliant.

---

## 🧼 Best Practices

* Always `.sanitize()` user input strings.
* Use `.optional()` only for truly non-required fields.
* Use `.custom(fn)` for complex logic (returns true or error message).
* Enum, pattern, and range are fast & safe.
* Error array helps frontend map validation errors instantly.

---

**See main [README.md](./README.md) for full project flow and more examples.**
