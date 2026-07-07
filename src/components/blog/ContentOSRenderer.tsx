import React, { ElementType } from 'react';

interface BlockProps {
  block: any;
}

const HeadingBlock: React.FC<BlockProps> = ({ block }) => {
  const level = block.props?.level || 2;
  const text = block.props?.text || '';
  
  const Tag = `h${Math.min(Math.max(level, 1), 6)}` as ElementType;
  
  const className = {
    1: 'text-4xl font-extrabold tracking-tight mb-8 mt-12',
    2: 'text-3xl font-bold tracking-tight mb-6 mt-10',
    3: 'text-2xl font-bold tracking-tight mb-5 mt-8',
    4: 'text-xl font-bold tracking-tight mb-4 mt-6',
    5: 'text-lg font-bold mb-3 mt-5',
    6: 'text-base font-bold mb-2 mt-4',
  }[level as 1|2|3|4|5|6] || 'text-2xl font-bold tracking-tight mb-5 mt-8';

  return <Tag className={className}>{text}</Tag>;
};

const ParagraphBlock: React.FC<BlockProps> = ({ block }) => {
  const text = block.props?.text || '';
  if (!text) return null;
  return <p className="mb-6 leading-[1.8] text-slate-700">{text}</p>;
};

const ImageBlock: React.FC<BlockProps> = ({ block }) => {
  const src = block.props?.url || '';
  const alt = block.props?.alt || '';
  const caption = block.props?.caption || '';
  
  if (!src) return null;
  
  return (
    <figure className="my-10">
      <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
        <img src={src} alt={alt} className="w-full h-auto object-cover max-h-[600px]" loading="lazy" />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-slate-500 mt-3 font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

const QuoteBlock: React.FC<BlockProps> = ({ block }) => {
  const text = block.props?.text || '';
  const author = block.props?.author || '';
  
  if (!text) return null;
  
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-emerald-500 bg-emerald-50/50 py-4 pr-4 rounded-r-xl italic text-slate-700">
      <p className="text-lg md:text-xl font-medium mb-2">"{text}"</p>
      {author && <footer className="text-sm font-semibold text-emerald-800 not-italic">— {author}</footer>}
    </blockquote>
  );
};

const CodeBlock: React.FC<BlockProps> = ({ block }) => {
  const code = block.props?.code || '';
  const language = block.props?.language || 'text';
  
  if (!code) return null;
  
  return (
    <div className="my-8 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg">
      <div className="flex items-center px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <span className="ml-4 text-xs font-mono text-slate-400 uppercase">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const DividerBlock = () => {
  return <hr className="my-12 border-t-2 border-slate-100 w-1/3 mx-auto rounded-full" />;
};

const ListBlock: React.FC<BlockProps> = ({ block }) => {
  const items = Array.isArray(block.props?.items) ? block.props.items : [];
  const style = block.props?.style === 'ordered' ? 'decimal' : 'disc';
  
  if (items.length === 0) return null;
  
  const Tag = style === 'decimal' ? 'ol' : 'ul';
  const listClass = style === 'decimal' 
    ? 'list-decimal list-outside ml-6 space-y-2 mb-6 text-slate-700 leading-relaxed' 
    : 'list-disc list-outside ml-6 space-y-2 mb-6 text-slate-700 leading-relaxed marker:text-emerald-500';
    
  return (
    <Tag className={listClass}>
      {items.map((item: any, i: number) => {
        const text = typeof item === 'string' ? item : item.text || '';
        return <li key={i} className="pl-1">{text}</li>;
      })}
    </Tag>
  );
};

const EmbedBlock: React.FC<BlockProps> = ({ block }) => {
  const html = block.props?.html || '';
  if (!html) return null;
  
  return (
    <div 
      className="my-8 rounded-xl overflow-hidden shadow-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const CalloutBlock: React.FC<BlockProps> = ({ block }) => {
  const text = block.props?.text || '';
  const type = block.props?.type || 'info'; // info, warning, success, error
  const title = block.props?.title || '';
  
  if (!text) return null;
  
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }[type as 'info'|'warning'|'success'|'error'] || 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <div className={`my-8 p-5 rounded-xl border ${styles}`}>
      {title && <h4 className="font-bold mb-2">{title}</h4>}
      <p className="leading-relaxed opacity-90">{text}</p>
    </div>
  );
};

export default function ContentOSRenderer({ blocks }: { blocks?: any[] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="contentos-blocks">
      {blocks.map((block, index) => {
        const type = block.type?.toLowerCase();
        
        switch (type) {
          case 'heading':
            return <HeadingBlock key={index} block={block} />;
          case 'paragraph':
            return <ParagraphBlock key={index} block={block} />;
          case 'image':
            return <ImageBlock key={index} block={block} />;
          case 'quote':
            return <QuoteBlock key={index} block={block} />;
          case 'code':
            return <CodeBlock key={index} block={block} />;
          case 'divider':
            return <DividerBlock key={index} />;
          case 'list':
            return <ListBlock key={index} block={block} />;
          case 'embed':
            return <EmbedBlock key={index} block={block} />;
          case 'callout':
            return <CalloutBlock key={index} block={block} />;
          default:
            // Fallback for unknown blocks - try to render basic text if it exists
            if (block.props?.text) {
              return <ParagraphBlock key={index} block={block} />;
            }
            return null;
        }
      })}
    </div>
  );
}
