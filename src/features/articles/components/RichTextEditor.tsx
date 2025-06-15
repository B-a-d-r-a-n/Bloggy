import React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react"; 
import StarterKit from "@tiptap/starter-kit";
import {
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
  MinusIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline"; 
interface RichTextEditorProps {
  content: string;
  onChange: (richText: string) => void;
  className?: string;
}
interface EditorToolbarProps {
  editor: Editor | null; 
}
interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}
const ToolbarButton = ({
  onClick,
  isActive,
  children,
  ariaLabel,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`btn btn-sm btn-ghost ${isActive ? "btn-active" : ""}`}
  >
    {children}
  </button>
);
const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 border border-base-300 bg-base-200 p-2 rounded-t-lg">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        ariaLabel="Bold"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        ariaLabel="Italic"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        ariaLabel="Strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <div className="divider divider-horizontal mx-1"></div>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        ariaLabel="Heading 1"
      >
        <span className="font-bold">H1</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        ariaLabel="Heading 2"
      >
        <span className="font-bold">H2</span>
      </ToolbarButton>
      <div className="divider divider-horizontal mx-1"></div>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        ariaLabel="Bullet List"
      >
        <ListBulletIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        ariaLabel="Numbered List"
      >
        <Bars3BottomLeftIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        ariaLabel="Blockquote"
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        ariaLabel="Horizontal Rule"
      >
        <MinusIcon className="h-5 w-5" />
      </ToolbarButton>
    </div>
  );
};
export default function RichTextEditor({
  content,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none p-4 min-h-[300px] border-x border-b border-base-300 rounded-b-lg focus:outline-none ${className}`,
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