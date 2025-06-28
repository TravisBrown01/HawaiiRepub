'use client';

import React from 'react';

interface FormattedContentProps {
  content: string;
  className?: string;
}

export function FormattedContent({ content, className = '' }: FormattedContentProps) {
  if (!content) return null;

  // Split content into paragraphs (double line breaks)
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={`text-gray-700 leading-relaxed ${className}`}>
      {paragraphs.map((paragraph, index) => {
        if (!paragraph.trim()) return null;

        // Process inline formatting within each paragraph
        const formattedParagraph = processInlineFormatting(paragraph);

        return (
          <div key={index} className="mb-4 last:mb-0">
            {formattedParagraph}
          </div>
        );
      })}
    </div>
  );
}

function processInlineFormatting(text: string): React.ReactNode[] {
  // Split by single line breaks to handle line breaks within paragraphs
  const lines = text.split(/\n/);
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      // Empty line - add spacing
      return <br key={lineIndex} />;
    }

    // Process bold text (**text** or __text__)
    const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      // Add the bold text
      const boldText = match[1] || match[2];
      parts.push(
        <strong key={`bold-${lineIndex}-${match.index}`} className="font-bold">
          {boldText}
        </strong>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last match
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    // If no formatting was found, return the original line
    if (parts.length === 0) {
      parts.push(line);
    }

    return (
      <React.Fragment key={lineIndex}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
} 