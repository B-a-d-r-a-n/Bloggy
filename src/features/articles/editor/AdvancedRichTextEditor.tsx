import type { ReactNode } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import { marked } from "marked";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
interface AdvancedRichTextEditorProps {
  content?: string;
  onChange: (newContent: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
const AdvancedRichTextEditor = ({
  content = "",
  onChange,
  disabled = false,
  placeholder = "Start writing your story...",
}: AdvancedRichTextEditorProps) => {
  const [text, setText] = useState<string>(content);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<string[]>([content]);
  const [undoIndex, setUndoIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update word and character counts
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  }, [text]);
  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);
      onChange?.(newText);

      // Add to undo stack
      if (newText !== undoStack[undoIndex]) {
        const newStack = undoStack.slice(0, undoIndex + 1);
        newStack.push(newText);
        if (newStack.length > 50) newStack.shift();
        setUndoStack(newStack);
        setUndoIndex(newStack.length - 1);
      }
    },
    [undoStack, undoIndex, onChange]
  );
  const undo = () => {
    if (undoIndex > 0) {
      const newIndex = undoIndex - 1;
      const previousText = undoStack[newIndex];
      setText(previousText);
      setUndoIndex(newIndex);
      onChange?.(previousText);
    }
  };
  const redo = () => {
    if (undoIndex < undoStack.length - 1) {
      const newIndex = undoIndex + 1;
      const nextText = undoStack[newIndex];
      setText(nextText);
      setUndoIndex(newIndex);
      onChange?.(nextText);
    }
  };
  const insertMarkdown = useCallback(
    (before: string, after = "", newLine = false) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = text.substring(start, end);
      let insertion = before + selectedText + after;
      if (newLine && start > 0 && text[start - 1] !== "\n") {
        insertion = "\n" + insertion;
      }
      const newText =
        text.substring(0, start) + insertion + text.substring(end);
      setText(newText);
      onChange?.(newText);

      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        const newPos =
          start +
          before.length +
          (newLine && start > 0 && text[start - 1] !== "\n" ? 1 : 0);
        textarea.setSelectionRange(newPos, newPos + selectedText.length);
      }, 0);
    },
    [text, onChange]
  );
  const insertList = useCallback(
    (type: "bullet" | "number") => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const lines = text.split("\n");
      let currentLine = 0;
      let charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= start) {
          currentLine = i;
          break;
        }
        charCount += lines[i].length + 1;
      }
      const prefix = type === "bullet" ? "• " : "1. ";
      const currentLineText = lines[currentLine];
      if (currentLineText.match(/^(\• |[0-9]+\. )/)) {
        // Remove existing list formatting
        lines[currentLine] = currentLineText.replace(/^(\• |[0-9]+\. )/, "");
      } else {
        // Add list formatting
        lines[currentLine] = prefix + currentLineText;
      }
      const newText = lines.join("\n");
      setText(newText);
      onChange?.(newText);
    },
    [text, onChange]
  );
  const insertTable = useCallback(() => {
    const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    insertMarkdown(tableMarkdown.trim(), "", true);
  }, [insertMarkdown]);
  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      insertMarkdown("[", `](${url})`);
    }
  }, [insertMarkdown]);
  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      const alt = prompt("Enter alt text (optional):") || "Image";
      insertMarkdown(`![${alt}](${url})`, "", true);
    }
  }, [insertMarkdown]);
  const convertToHtml = useCallback((markdown: string): string => {
    if (!markdown?.trim()) {
      return "";
    }
    const rawHtml = marked.parse(markdown) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return cleanHtml;
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            insertMarkdown("**", "**");
            break;
          case "i":
            e.preventDefault();
            insertMarkdown("*", "*");
            break;
          case "u":
            e.preventDefault();
            insertMarkdown("__", "__");
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "k":
            e.preventDefault();
            insertLink();
            break;
        }
      }
    },
    [insertMarkdown, insertLink, undo, redo]
  );
  interface ButtonGroupProps {
    children: ReactNode;
  }
  interface ToolbarButtonProps {
    onClick: () => void;
    children: ReactNode;
    title: string;
    active?: boolean;
    disabled?: boolean;
  }
  const ToolbarButton = ({
    onClick,
    children,
    title,
    active = false,
    disabled: buttonDisabled = false,
  }: ToolbarButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled || buttonDisabled}
      className={`btn btn-sm btn-ghost ${active ? "btn-active" : ""}`}
    >
      {children}
    </button>
  );
  const ButtonGroup = ({ children }: ButtonGroupProps) => (
    <div className="flex items-center rounded-lg">{children}</div>
  );
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content/50 prose mb-2">
          Let your imagination run wild
        </h1>
      </div>
      <div className="border border-base-300 rounded-lg shadow-sm bg-base-100">
        {}
        <div className="flex flex-wrap items-center gap-x-2 p-2 bg-base-200 border-b border-base-300">
          {/* Text Formatting */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => insertMarkdown("**", "**")}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("*", "*")}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("__", "__")}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("~~", "~~")}
              title="Strikethrough"
            >
              <s>S</s>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("`", "`")}
              title="Inline Code"
            >
              &lt;/&gt;
            </ToolbarButton>
          </ButtonGroup>
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Headers */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => insertMarkdown("# ", "")}
              title="Heading 1"
            >
              H1
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("## ", "")}
              title="Heading 2"
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("### ", "")}
              title="Heading 3"
            >
              H3
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("> ", "")}
              title="Blockquote"
            >
              💬
            </ToolbarButton>
          </ButtonGroup>
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Lists */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => insertList("bullet")}
              title="Bullet List"
            >
              • List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertList("number")}
              title="Numbered List"
            >
              1. List
            </ToolbarButton>
          </ButtonGroup>
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Media & Links */}
          <ButtonGroup>
            <ToolbarButton onClick={insertLink} title="Insert Link (Ctrl+K)">
              🔗
            </ToolbarButton>
            <ToolbarButton onClick={insertImage} title="Insert Image">
              🖼️
            </ToolbarButton>
            <ToolbarButton onClick={insertTable} title="Insert Table">
              📊
            </ToolbarButton>
            <ToolbarButton
              onClick={() => insertMarkdown("```\n", "\n```", true)}
              title="Code Block"
            >
              📝
            </ToolbarButton>
          </ButtonGroup>
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Undo/Redo */}
          <ButtonGroup>
            <ToolbarButton
              onClick={undo}
              disabled={undoIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </ToolbarButton>
            <ToolbarButton
              onClick={redo}
              disabled={undoIndex >= undoStack.length - 1}
              title="Redo (Ctrl+Shift+Z)"
            >
              ↷
            </ToolbarButton>
          </ButtonGroup>
          <div className="flex-1"></div>

          {/* View Controls */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => setShowShortcuts(!showShortcuts)}
              active={showShortcuts}
              title="Toggle Shortcuts"
            >
              ⌨️
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setIsPreview(!isPreview)}
              active={isPreview}
              title="Toggle Preview"
            >
              {isPreview ? "✏️ Edit" : "👁️ Preview"}
            </ToolbarButton>
          </ButtonGroup>
        </div>

        {/* Keyboard Shortcuts Panel */}
        {showShortcuts && (
          <div className="p-4 bg-blue-50 border-b text-sm">
            <h4 className="font-semibold mb-2">Keyboard Shortcuts:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div>
                <kbd className="bg-white px-1 rounded border">Ctrl+B</kbd> Bold
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Ctrl+I</kbd>{" "}
                Italic
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Ctrl+U</kbd>{" "}
                Underline
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Ctrl+K</kbd> Link
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Ctrl+Z</kbd> Undo
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Ctrl+Shift+Z</kbd>{" "}
                Redo
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Tab</kbd> Indent
              </div>
              <div>
                <kbd className="bg-white px-1 rounded border">Shift+Tab</kbd>{" "}
                Outdent
              </div>
            </div>
          </div>
        )}

        {/* Editor/Preview */}
        <div className="relative">
          {isPreview ? (
            <div className="p-4 min-h-[400px] bg-base-100">
              {text.trim() ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: convertToHtml(text) }}
                />
              ) : (
                <div className="italic text-base-content/50">
                  Nothing to preview yet. Start writing!
                </div>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              className="textarea w-full p-4 min-h-[400px] resize-none focus:outline-none border-0 text-base leading-relaxed"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            />
          )}

          {/* Status Bar */}
          <div className="absolute bottom-2 right-4 text-xs text-base-content/50 bg-base-100/50 backdrop-blur-sm px-2 py-1 rounded">
            {wordCount} words • {charCount} characters
          </div>
        </div>
      </div>

      {/* --- Themed Markdown Guide --- */}
      <div className="mt-8 p-6 bg-base-200 rounded-lg">
        <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
          <span className="text-xl">✨</span>
          Markdown Quick Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          {/* Column 1: Text Formatting */}
          <div className="space-y-2">
            <h4 className="font-semibold text-base-content">Text Formatting</h4>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">**bold**</kbd> → <strong>bold</strong>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">*italic*</kbd> → <em>italic</em>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">~~strike~~</kbd> → <s>strike</s>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">`code`</kbd> →{" "}
              <code className="bg-base-300 px-1 rounded">code</code>
            </div>
          </div>

          {/* Column 2: Structure */}
          <div className="space-y-2">
            <h4 className="font-semibold text-base-content">Structure</h4>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm"># Heading 1</kbd>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">## Heading 2</kbd>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">• Bullet list</kbd>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">1. Numbered list</kbd>
            </div>
          </div>

          {/* Column 3: Media & Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-base-content">Media & Links</h4>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">[link](url)</kbd>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">![image](url)</kbd>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">{">"} blockquote</kbd>
            </div>
            <div className="text-base-content/80">
              <kbd className="kbd kbd-sm">```code block```</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* --- Themed HTML Output (Collapsible) --- */}
      <details className="collapse bg-base-200 mt-6 shadow-sm">
        <summary className="collapse-title font-semibold">
          📄 View Rendered HTML
        </summary>
        <div className="collapse-content">
          {}
          <div className="mockup-code text-sm">
            <pre data-prefix="~">
              <code>{convertToHtml(text) || "<p>No content yet.</p>"}</code>
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
};
export default AdvancedRichTextEditor;
