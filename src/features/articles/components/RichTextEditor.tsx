import React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react"; // <-- Import the Editor type
import StarterKit from "@tiptap/starter-kit";
import {
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
  MinusIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline"; // <-- Import from Heroicons

// --- PROPS INTERFACES ---
interface RichTextEditorProps {
  content: string;
  onChange: (richText: string) => void;
  className?: string;
}

interface EditorToolbarProps {
  editor: Editor | null; // <-- Use the official Editor type
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}

// --- REUSABLE COMPONENTS ---

// 1. Reusable Button Component to reduce repetition
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

// 2. Toolbar component for the editor
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

// 3. Main Editor Component
export default function RichTextEditor({
  content,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable extensions you don't have a button for, like 'code'
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
        // Use prose-pre:bg-base-300 etc. to style code blocks if you re-enable them
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
