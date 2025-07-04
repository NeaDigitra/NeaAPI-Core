/**
 * Field Rule Builder
 * - This function creates a rule object for a specific field.
 * - It allows chaining methods to define the type, validation rules, and sanitization options.
 */
function fieldRuleBuilder(fieldName) {
  return {
    fieldName: fieldName,
    type: null,
    isOptional: false,
    lengthRules: null,
    rangeRules: null,
    enumValues: null,
    regexPattern: null,
    customRules: [],
    enableSanitize: false,
    isString() {
      this.type = 'string'
      return this
    },
    isNumber() {
      this.type = 'number'
      return this
    },
    isBoolean() {
      this.type = 'boolean'
      return this
    },
    isEmail() {
      this.type = 'email'
      return this
    },
    isFile() {
      this.type = 'file'
      return this
    },
    isArray() {
      this.type = 'array'
      return this
    },
    isObject() {
      this.type = 'object'
      return this
    },
    length(lengthRules) {
      if (lengthRules && typeof lengthRules === 'object') {
        this.lengthRules = {
          min: typeof lengthRules.min === 'number' ? lengthRules.min : null,
          max: typeof lengthRules.max === 'number' ? lengthRules.max : null
        }
      }
      return this
    },
    range(rangeRules) {
      if (rangeRules && typeof rangeRules === 'object') {
        this.rangeRules = {
          min: typeof rangeRules.min === 'number' ? rangeRules.min : null,
          max: typeof rangeRules.max === 'number' ? rangeRules.max : null
        }
      }
      return this
    },
    enum(allowedValues) {
      if (Array.isArray(allowedValues)) {
        this.enumValues = allowedValues
      }
      return this
    },
    pattern(regex) {
      if (regex instanceof RegExp) {
        this.regexPattern = regex
      }
      return this
    },
    custom(ruleFunction) {
      if (typeof ruleFunction === 'function') {
        this.customRules.push(ruleFunction)
      }
      return this
    },
    optional() {
      this.isOptional = true
      return this
    },
    sanitize() {
      this.enableSanitize = true
      return this
    }
  }
}

/**
 * Sanitize Value Manual XSS Blocker
 * - This function sanitizes a string value to prevent XSS attacks.
 * - It removes dangerous HTML tags, attributes, and inline event handlers.
 */
function sanitizeValue(value) {
  if (typeof value !== 'string') return value
  let clean = value.trim()
  const dangerousTags = ['script', 'iframe', 'img', 'svg', 'object', 'embed', 'link', 'meta']
  dangerousTags.forEach(tag => {
    const tagPattern = new RegExp(`<${tag}.*?>.*?<\\/${tag}>`, 'gis')
    clean = clean.replace(tagPattern, '')
  })
  dangerousTags.forEach(tag => {
    const selfCloseTagPattern = new RegExp(`<${tag}[^>]*?\\/?>`, 'gis')
    clean = clean.replace(selfCloseTagPattern, '')
  })
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  clean = clean.replace(/\s*on\w+\s*=\s*(['"]).*?\1/gi, '')
  clean = clean.replace(/\s*on\w+\s*=\s*[^ >]+/gi, '')
  clean = clean.replace(/\s*style\s*=\s*(['"]).*?\1/gi, '')
  clean = clean.replace(/\s*style\s*=\s*[^ >]+/gi, '')
  clean = clean.replace(/javascript:/gi, '')
  clean = clean.replace(/vbscript:/gi, '')
  clean = clean.replace(/data:/gi, '')
  clean = clean.replace(/alert\(.+?\)/gi, '')
  clean = clean.replace(/eval\(.+?\)/gi, '')
  clean = clean.replace(/expression\(.+?\)/gi, '')
  return clean
}

/**
 * Exports
 */
module.exports = {
  field: function (fieldName) {
    return fieldRuleBuilder(fieldName)
  },
  sanitizeValue: sanitizeValue
}