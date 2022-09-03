import * as Monaco from 'monaco-editor'
import type { PropType } from 'vue'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker (_, label) {
    if (label === 'json') {
      return new JsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker()
    }
    return new EditorWorker()
  }
}

export default defineComponent({
  props: {
    code: {
      type: String as PropType<string>,
      required: true
    },
    onChange: {
      type: Function as PropType<(value: string, event: Monaco.editor.IModelContentChangedEvent) => void>,
      required: true
    },
    title: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup (props) {
    // must be shallowRef, if not, editor.getValue() won't work
    const editorRef = shallowRef()

    const containerRef = ref()

    let _subscription: Monaco.IDisposable | undefined
    let __prevent_trigger_change_event = false

    onMounted(() => {
      const editor = editorRef.value = Monaco.editor.create(containerRef.value, {
        value: props.code,
        language: 'json',
        formatOnPaste: true,
        tabSize: 2,
        minimap: {
          enabled: false
        }
      })

      _subscription = editor.onDidChangeModelContent(event => {
        console.log('--------->', __prevent_trigger_change_event)
        if (!__prevent_trigger_change_event) {
          props.onChange(editor.getValue(), event)
        }
      })
    })

    onBeforeUnmount(() => {
      if (_subscription) { _subscription.dispose() }
    })

    watch(() => props.code, v => {
      const editor = editorRef.value
      const model = editor.getModel()
      if (v !== model.getValue()) {
        editor.pushUndoStop()
        __prevent_trigger_change_event = true
        // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
        model.pushEditOperations([],
          [
            {
              range: model.getFullModelRange(),
              text: v
            }
          ])
        editor.pushUndoStop()
        __prevent_trigger_change_event = false
      }
    })

    return () => (
      <div className="border rounded-5px flex flex-col">
        <div className="bg-#eee p-y[10px] pl-20px">
          <span>{props.title}</span>
        </div>
        <div className="flex-grow h-500px" ref={containerRef}></div>
      </div>
    )
  }
})
