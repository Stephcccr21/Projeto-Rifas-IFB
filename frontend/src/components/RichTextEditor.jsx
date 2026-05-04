import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}