'use client';

interface MeditationContentProps {
  content: string;
}

export function MeditationContent({ content }: MeditationContentProps) {
  return (
    <div
      className="meditation-content prose max-w-none"
      style={{ fontFamily: 'var(--font-body)' }}
      // Note: In production, sanitize HTML with DOMPurify before rendering
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
