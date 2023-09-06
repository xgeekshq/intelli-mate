import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { CodeBlock } from '@/components/ui/codeblock';

interface MarkdownProps {
  content: string;
}

const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      className={
        'prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0'
      }
      components={{
        code({ node, inline, className, children, ...props }) {
          if (children.length) {
            if (children[0] == '▍') {
              return (
                <span className="mt-1 animate-pulse cursor-default">▍</span>
              );
            }

            children[0] = (children[0] as string).replace('`▍`', '▍');
          }

          const match = /language-(\w+)/.exec(className || '');

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              language={(match && match[1]) || ''}
              value={String(children).replace(/\n$/, '')}
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
