const { sanitizeValue } = require('./field')

/**
 * Validate Input
 * - This function validates the input data against the provided field rules.
 * - It checks for required fields, data types, length, patterns, and custom rules.
 */
function validateInput(fieldRules) {
  return function (req, res, next) {
    req.body = req.body || {}
    req.query = req.query || {}
    req.params = req.params || {}
    req.files = req.files || {}
    const errors = runValidation(req, fieldRules)
    if (errors.length > 0) {
      return res.api('validation_error', errors)
    }
    next()
  }
}

/**
 * Run Validation
 * - This function runs the validation rules against the input data.
 * - It checks for required fields, data types, length, patterns, and custom rules.
 */
function runValidation(inputData, fieldRules) {
  const validationErrors = []
  if (!(Array.isArray(fieldRules)) || fieldRules.length === 0) {
    validationErrors.push({
      field: '_config',
      message: 'Validator FieldRules Invalid Or Missing'
    })
    return validationErrors
  }
  fieldRules.forEach(function (singleRule) {
    if (!(singleRule && typeof singleRule === 'object' && singleRule.fieldName)) {
      validationErrors.push({
        field: '_config',
        message: 'Invalid Rule Detected'
      })
      return
    }
    let value = resolveFieldValue(inputData, singleRule.fieldName)
    if (value === '__DUPLICATE_QUERY_PARAM__') {
      validationErrors.push({
        field: singleRule.fieldName,
        message: 'Duplicate Query Parameter'
      })
      return
    }
    if (value === '__DUPLICATE_BODY_PARAM__') {
      validationErrors.push({
        field: singleRule.fieldName,
        message: 'Duplicate Body Parameter'
      })
      return
    }
    if (singleRule.enableSanitize) {
      value = sanitizeValue(value)
      setFieldValue(inputData, singleRule.fieldName, value)
    }
    if (!(value) && !(singleRule.isOptional)) {
      validationErrors.push({
        field: singleRule.fieldName,
        message: 'Field Is Required'
      })
      return
    }
    if (!(value)) {
      return
    }

    if (singleRule.type === 'string') {
      if (typeof value !== 'string') {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Must Be String'
        })
        return
      }
      if (singleRule.lengthRules) {
        if (singleRule.lengthRules.min !== null && value.length < singleRule.lengthRules.min) {
          validationErrors.push({
            field: singleRule.fieldName,
            message: 'Length Too Short'
          })
        }
        if (singleRule.lengthRules.max !== null && value.length > singleRule.lengthRules.max) {
          validationErrors.push({
            field: singleRule.fieldName,
            message: 'Length Too Long'
          })
        }
      }
      if (singleRule.regexPattern) {
        if (!(singleRule.regexPattern.test(value))) {
          validationErrors.push({
            field: singleRule.fieldName,
            message: 'Pattern Mismatch'
          })
        }
      }
    } else if (singleRule.type === 'number') {
      const numericValue = Number(value)
      if (isNaN(numericValue)) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Must Be Number'
        })
        return
      }
      if (singleRule.rangeRules) {
        if (singleRule.rangeRules.min !== null && numericValue < singleRule.rangeRules.min) {
          validationErrors.push({
            field: singleRule.fieldName,
            message: 'Number Too Small'
          })
        }
        if (singleRule.rangeRules.max !== null && numericValue > singleRule.rangeRules.max) {
          validationErrors.push({
            field: singleRule.fieldName,
            message: 'Number Too Large'
          })
        }
      }
    } else if (singleRule.type === 'boolean') {
      if (!(value === true || value === false || value === '1' || value === '0' || value === 1 || value === 0 || value === 'true' || value === 'false')) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Must Be Boolean'
        })
        return
      }
    } else if (singleRule.type === 'email') {
      if (!(typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Invalid Email'
        })
      }
    } else if (singleRule.type === 'file') {
      if (!(value && typeof value === 'object' && value.originalname)) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Invalid File'
        })
      }
    } else if (singleRule.type === 'array') {
      if (!(Array.isArray(value))) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Must Be Array'
        })
      }
    } else if (singleRule.type === 'object') {
      if (!(value && typeof value === 'object' && !(Array.isArray(value)))) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Must Be Object'
        })
      }
    }
    if (singleRule.enumValues) {
      if (!(singleRule.enumValues.includes(value))) {
        validationErrors.push({
          field: singleRule.fieldName,
          message: 'Invalid Value'
        })
      }
    }
    if (singleRule.customRules.length > 0) {
      singleRule.customRules.forEach(function (customFn) {
        const customResult = customFn(value)
        if (customResult !== true) {
          validationErrors.push({
            field: singleRule.fieldName,
            message: customResult || 'Custom Rule Failed'
          })
        }
      })
    }
  })
  return validationErrors
}

/**
 * Resolve Field Value
 * - This function resolves the value of a field in the input data.
 * - It checks the body, query, params, and files for the field value.
 */
function resolveFieldValue(inputData, fieldName) {
  if (hasDuplicateKey(inputData.body, fieldName)) {
    return '__DUPLICATE_BODY_PARAM__'
  }
  if (fieldName in inputData.body) {
    return inputData.body[fieldName]
  }
  if (fieldName in inputData.query) {
    const value = inputData.query[fieldName]
    if (Array.isArray(value)) {
      return '__DUPLICATE_QUERY_PARAM__'
    }
    return value
  }
  if (fieldName in inputData.params) {
    return inputData.params[fieldName]
  }
  if (fieldName in inputData.files) {
    return inputData.files[fieldName]
  }
  return undefined
}

/**
 * Check for Duplicate Key
 * - This function checks if a field appears more than once in the raw body.
 * - It uses a regular expression to find all occurrences of the field name.
 */
function hasDuplicateKey(rawBody, fieldName) {
  if (!(rawBody) || !(fieldName) || !(Array.isArray(rawBody[fieldName]))) {
    return false
  }
  const seen = new Set()
  for (const val of rawBody[fieldName]) {
    if (seen.has(val)) {
      return true
    }
    seen.add(val)
  }
  return false
}

/**
 * Set Field Value
 * - This function sets the value of a field in the input data.
 * - It updates the body, query, or params based on where the field is found.
 */
function setFieldValue(inputData, fieldName, value) {
  if (fieldName in inputData.body) {
    inputData.body[fieldName] = value
  } else if (fieldName in inputData.query) {
    inputData.query[fieldName] = value
  } else if (fieldName in inputData.params) {
    inputData.params[fieldName] = value
  }
}

/**
 * Exports
 */
module.exports = {
  resolveFieldValue,
  runValidation,
  setFieldValue,
  validateInput
}