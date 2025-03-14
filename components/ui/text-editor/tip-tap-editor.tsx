"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import ToolBar from "./toolbar";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Paragraph from "@tiptap/extension-paragraph";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

const TextEditor = ({
  showToolbar = true,
  value,
  onChange,
}: {
  showToolbar?: boolean;
  value: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Paragraph,
      CustomHeading,
      Blockquote.configure({
        HTMLAttributes: {
          class:
            "mt-6 border-l-2 pl-6 italic bg-muted/20 text-primary font-medium text-sm",
        },
      }),
      BulletList.configure({
        HTMLAttributes: { class: "mt-2 ml-6 list-disc [&>li]:mt-2" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "mt-2 ml-6 list-decimal [&>li]:mt-2" },
      }),
      // History,
      HorizontalRule.configure({
        HTMLAttributes: { class: "my-4 border-border/90 border-t-[1px]" },
      }),
      ListItem,
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[600px] w-full rounded-lg border-border/90 border-[1px] bg-background p-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {showToolbar && <ToolBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;

const CustomHeading = Heading.configure({
  levels: [1, 2, 3, 4], // Define heading levels
  HTMLAttributes: {
    class: "font-bold tracking-tight", // Apply general classes for all levels
  },
}).extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;

    // Define specific classes for each level
    const levelClassMap: Record<number, string> = {
      1: "text-xl lg:text-2xl font-bold",
      2: "text-lg lg:text-xl font-semibold",
      3: "text-base lg:text-lg font-semibold",
      4: "text-sm lg:text-base font-semibold",
    };

    return [
      `h${level}`,
      {
        ...HTMLAttributes,
        class: `${HTMLAttributes.class || ""} ${levelClassMap[level] || ""}`,
      },
      0,
    ];
  },
});
