import React from 'react';

// Renders user text as plain React text; `<br>` tags and newlines become line breaks, everything else is escaped.
export function TextWithBreaks({ text }: { text?: string | null }) {
  const lines = String(text ?? '').split(/<br\s*\/?>|\r?\n/i);
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </>
  );
}

export default TextWithBreaks;
