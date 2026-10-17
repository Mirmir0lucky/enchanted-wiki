// GitHub-style alerts: > [!NOTE] > [!TIP] > [!IMPORTANT] > [!WARNING] > [!CAUTION]
// Turns them into <div class="callout callout-note"> with a title line.

const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

function transform(node: MdNode) {
  if (node.type === "blockquote" && node.children && node.children.length > 0) {
    const first = node.children[0];
    const text = first.type === "paragraph" ? first.children?.[0] : undefined;
    const match = text && text.type === "text" && text.value ? MARKER.exec(text.value) : null;

    if (match && text && first.children) {
      const kind = match[1].toLowerCase();
      text.value = (text.value ?? "").slice(match[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();

      const label = kind.charAt(0).toUpperCase() + kind.slice(1);
      node.children.unshift({
        type: "paragraph",
        data: { hProperties: { className: ["callout-title"] } },
        children: [{ type: "text", value: label }],
      });
      node.data = { hName: "div", hProperties: { className: ["callout", `callout-${kind}`] } };
    }
  }
  node.children?.forEach(transform);
}

export function remarkCallouts() {
  return (tree: any) => {
    transform(tree as MdNode);
  };
}
