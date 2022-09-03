import type { Ref } from 'vue'
import MonacoEditor from '~/components/MonacoEditor'

export default defineComponent({
  setup () {
    const schema = {
      type: 'string'
    }
    const schemaRef: Ref<any> = ref(schema)

    const jsonToString = (code: any) => {
      return JSON.stringify(code, null, 2)
    }

    const stringToJson = (code: any) => {
      return JSON.stringify(code, null, 2)
    }

    const handCodeChange = (code: string) => {
      let data: any
      try {
        data = stringToJson(code)
        schemaRef.value = data
      } catch (err) {
        console.log(err, 'err')
      }
    }

    return () => {
      const code = jsonToString(schemaRef.value)
      return (
        <MonacoEditor
          code={code}
          onChange={handCodeChange}
          title="Schema"
        />
      )
    }
  }
})

