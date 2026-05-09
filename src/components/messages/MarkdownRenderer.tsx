import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? '')
          const isBlock = match !== null
          if (isBlock) {
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md text-xs"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          }
          return (
            <code
              className="rounded bg-[var(--bg-code)] px-1 py-0.5 font-mono text-xs text-[var(--accent)]"
              {...props}
            >
              {children}
            </code>
          )
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        },
        strong({ children }) {
          return <strong className="font-semibold text-[var(--text)]">{children}</strong>
        },
        ul({ children }) {
          return <ul className="mb-2 list-disc pl-4 space-y-1">{children}</ul>
        },
        ol({ children }) {
          return <ol className="mb-2 list-decimal pl-4 space-y-1">{children}</ol>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
