import { useRef, useEffect } from '@wordpress/element';

export const useEditorSetup = () => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.editor.setOption("indentedSoftWrap", false);
        }
    }, [editorRef]);

    return [ editorRef ];
};
