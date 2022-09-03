import Ajv from 'ajv'
import ajvFormats from 'ajv-formats'

const ajv = new Ajv()
ajvFormats(ajv)

ajv.addFormat('nameIsHaha', data => {
  console.log(data, 'data11')
  return data === 'nameIsHaha'
})

const schema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
      minLength: 10,
      format: 'nameIsHaha'
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
  name: 'nameIsHaha',
  age: 18,
  pets: ['dog'],
  isWorker: true
}

const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) {
  console.log(validate.errors)
}
