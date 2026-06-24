function normalizeBlocks(input: string | string[]) {
  const text = Array.isArray(input) ? input.join("\n\n") : input;
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function ArticleBody({ body }: { body: string | string[] }) {
  const blocks = normalizeBlocks(body);

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        const imageMatch = block.match(/^!\[(.*)]\((.+)\)$/);
        if (imageMatch) {
          return (
            <figure className="article-media" key={`${block}-${index}`}>
              <img src={imageMatch[2]} alt={imageMatch[1] || "文章图片"} />
              {imageMatch[1] ? <figcaption>{imageMatch[1]}</figcaption> : null}
            </figure>
          );
        }
        const videoMatch = block.match(/^::video\[(.*)]\((.+)\)$/);
        if (videoMatch) {
          return (
            <figure className="article-media" key={`${block}-${index}`}>
              <video src={videoMatch[2]} controls preload="metadata" playsInline />
              {videoMatch[1] ? <figcaption>{videoMatch[1]}</figcaption> : null}
            </figure>
          );
        }
        if (block.startsWith("## ")) {
          return <h2 key={`${block}-${index}`}>{block.replace(/^##\s+/, "")}</h2>;
        }
        if (block.startsWith("### ")) {
          return <h3 key={`${block}-${index}`}>{block.replace(/^###\s+/, "")}</h3>;
        }
        if (block.startsWith("> ")) {
          return <blockquote key={`${block}-${index}`}>{block.replace(/^>\s+/, "")}</blockquote>;
        }
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.length > 1 && lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={`${block}-${index}`}>
              {lines.map((line) => <li key={line}>{line.replace(/^-\s+/, "")}</li>)}
            </ul>
          );
        }
        return <p key={`${block}-${index}`}>{block}</p>;
      })}
    </div>
  );
}
