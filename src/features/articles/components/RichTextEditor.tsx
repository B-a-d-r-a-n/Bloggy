import React from "react";
import {
  useEditor,
  EditorContent,
  //   FloatingMenu,
  //   BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  //   Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Minus,
} from "lucide-react"; // A great icon library: npm install lucide-react

interface RichTextEditorProps {
  content: string;
  onChange: (richText: string) => void;
  className?: string;
}

// Toolbar component for the editor
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border border-base-300 bg-base-200 p-2 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("bold") ? "btn-active" : ""}`}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("italic") ? "btn-active" : ""}`}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("strike") ? "btn-active" : ""}`}
      >
        <Strikethrough size={16} />
      </button>
      <div className="divider divider-horizontal mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("heading", { level: 1 }) ? "btn-active" : ""}`}
      >
        <Heading1 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("heading", { level: 2 }) ? "btn-active" : ""}`}
      >
        <Heading2 size={16} />
      </button>
      <div className="divider divider-horizontal mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("bulletList") ? "btn-active" : ""}`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("orderedList") ? "btn-active" : ""}`}
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive("blockquote") ? "btn-active" : ""}`}
      >
        <Quote size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="btn btn-sm btn-ghost"
      >
        <Minus size={16} />
      </button>
    </div>
  );
};

// Main Editor Component
export default function RichTextEditor({
  content,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // You can configure the starter kit here if needed
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none p-4 min-h-[300px] border border-base-300 rounded-b-lg focus:outline-none focus:border-primary ${className}`,
      },
    },
  });

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
