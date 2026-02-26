'use client';

interface BibleQuoteProps {
  text: string;
  reference: string;
}

export function BibleQuote({ text, reference }: BibleQuoteProps) {
  return (
    <div className="bible-quote rounded-xl p-5 my-8">
      <p className="text-lg md:text-xl italic text-ink-900 leading-relaxed mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        &laquo; {text} &raquo;
      </p>
      <p className="text-sm font-semibold text-gold-600">
        &mdash; {reference}
      </p>
    </div>
  );
}
