import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv()
addFormats(ajv)

const schema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
      minLength: 10,
      format: 'email'
    },
    age: {
      type: 'number'
    },
    pets: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    isWorker: {
      type: 'boolean'
    }
  }
}

const data = {
  name: 'name123456@qq.com',
  age: 18,
  pets: ['dog'],
  isWorker: true
}

const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) {
  console.log(validate.errors)
}
