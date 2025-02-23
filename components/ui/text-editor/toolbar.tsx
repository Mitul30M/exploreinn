import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Underline,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  TextQuote,
  ListEnd,
  ListStart,
  Ruler,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Toggle } from "../toggle";

export default function TextEditorMenuBar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;

  return (
    <ToggleGroup
      type="multiple"
      variant={"outline"}
      size="sm"
      className="flex justify-start items-center gap-1 p-1 rounded-md"
    >
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        value="heading1"
        aria-label="Toggle Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        value="heading2"
        aria-label="Toggle Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        value="heading2"
        aria-label="Toggle Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("heading", { level: 4 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 4 }).run()
        }
        value="heading4"
        aria-label="Toggle Heading 4"
      >
        <Heading4 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        value="bold"
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        value="italic"
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        value="underline"
        aria-label="Toggle underline"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        value="strike"
        aria-label="Toggle strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("bulletedList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        value="bulletedList"
        aria-label="Toggle bulleted list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        value="orderedList"
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        disabled={!editor.can().sinkListItem("listItem")}
        onPressedChange={() =>
          editor.chain().focus().sinkListItem("listItem").run()
        }
        value="sinkListItem"
        aria-label="Sink List Iem"
      >
        <ListEnd className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        disabled={!editor.can().liftListItem("listItem")}
        onPressedChange={() =>
          editor.chain().focus().liftListItem("listItem").run()
        }
        value="liftListItem"
        aria-label="Lift List Iem"
      >
        <ListStart className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        value="blockquote"
        aria-label="Toggle blockquote"
      >
        <TextQuote className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        value="horizontalRule"
        aria-label="horizontalRule"
      >
        <Ruler className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={false} // Undo doesn't have an `isActive` state
        onPressedChange={() => editor.chain().focus().undo().run()}
        value="undo"
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={false} // Redo doesn't have an `isActive` state
        onPressedChange={() => editor.chain().focus().redo().run()}
        value="redo"
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Toggle>
    </ToggleGroup>
  );
}
