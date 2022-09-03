const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
// const localize = require('ajv-i18n')

// 这里需要注意，如果使用了转换语言错误，则自定义的保存信息会失效，目前原因不清楚。
// 估计是 ajv-i8n 这个库的在编写的时候 判断逻辑优先级提的很高。
const ajv = new Ajv({ allErrors: true })
ajvFormats(ajv)
require("ajv-errors")(ajv)

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
      minLength: 10,
      // format: 'nameIsHaha',
      // nameKeyword: false,
      errorMessage: {
        // 这里 的属性必须是直接写在 schema 下的属性，不能通过 macro 方法添加！！！
        type: '必须是字符串',
        minLength: '长度必须大于10'
      }
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
  // 自定义错误信息的时候不能使用 错误语言转换。
  // localize.zh(validate.errors)
  console.log(validate.errors)
}
