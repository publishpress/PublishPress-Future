import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";


export const ConditionPreview = ({ defaultValue, editorRef, editorProps, editorOptions }) => {
    if (!defaultValue?.natural) return null;

    return (
      <AceEditor
        ref={editorRef}
        mode="handlebars"
        theme="textmate"
        name="expression-builder-natural-language"
        className="read-only-editor settings-panel"
        wrapEnabled={true}
        value={defaultValue?.natural || ''}
        editorProps={editorProps}
        readOnly={true}
        setOptions={editorOptions}
      />
    );
  };
