import { useState, useRef } from 'react';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { Milkdown, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { gfm } from '@milkdown/preset-gfm';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
// import '@milkdown/theme-nord/style.css';
import '../style/editor.scss';
import { useUpdateEffect, useKeyPress } from 'ahooks';

interface EditorProps {
  data: any;
  update: (pageId: string, content: string) => void;
}
export const MilkdownEditor = (props: EditorProps) => {
  const { data, update } = props;
  const editorRef = useRef<any>();
  const [content, setContent] = useState(data?.content);

  useUpdateEffect(() => {
    update(data.id, content);
  }, [content]);

  editorRef.current = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, data?.content || '');
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .config((ctx) => {
        const listener = ctx.get(listenerCtx);
        listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            setContent(markdown);
          }
        });
      })
      .use(listener);
  }, []);

  useKeyPress(
    ['meta.s', 'ctrl.s'],
    (e) => {
      update(data.id, content);
      e.preventDefault();
    },
    {
      exactMatch: true,
      useCapture: true,
    }
  );

  return (
    <div className="prose prose-stone prose-sm outline-none flex-1 markdown-editor">
      <Milkdown />
    </div>
  );
};
