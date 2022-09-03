import Ajv from 'ajv'
import ajvFormats from 'ajv-formats'
import localize from 'ajv-i18n'

const ajv = new Ajv()
ajvFormats(ajv)

ajv.addFormat('nameIsHaha', data => {
  return data === 'nameIsHaha'
})

ajv.addKeyword({
  keyword: 'nameKeyword',
  // 定义关键字的类型
  // metaSchema: {
  //   type: 'number'
  // }
  // 通用模式。
  // validate: (schame, data) => {
  //   // 这里传进来的可以是任何东西，所以不能直接使用 if(schame) 进行判断。
  //   if (schame === true) {
  //     return true
  //   } else {
  //     return data.length === 10
  //   }
  // },
  // 以下为更多功能
  // compile (sch, parentSchema) {
  //   console.log(sch, parentSchema)
  //   return () => true
  //   // return parentSchema.exclusiveRange === true
  //   //   ? data => data > min && data < max
  //   //   : data => data >= min && data <= max
  // },
  // 推荐使用下面这个！！！！！！
  // 编译阶段 返回一个 schema 添加到 使用自定义 keyword 的当前 schema 的配置中。
  macro () {
    return {
      minLength: 10
    }
  }
})

const schema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
      // minLength: 10,
      format: 'nameIsHaha',
      nameKeyword: false
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
  name: 'name',
  age: 18,
  pets: ['dog'],
  isWorker: true
}

const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) {
  localize.zh(validate.errors)
  console.log(validate.errors)
}
