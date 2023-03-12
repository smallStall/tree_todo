import { memo, useState } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import type { Atom, WritableAtom } from "jotai";

type Node = {
  text: string;
  value: AtomNode;
  childNodes: Atom<AtomNode[]>;
};

type AtomNode = WritableAtom<Node, Partial<Node>[], void>;

const rootNodes = atom([]);
const appendNode = atom(null, (_get, set, [nodes, value]) => {
  const node = atom({
    value: atom(value),
    childNodes: atom([]),
  });
  set(nodes, (prev: AtomNode[]) => [...prev, node]);
});

const total = atom((get) => {
  const sum = (nodes: Atom<AtomNode[]>): number => {
    const arr = get(nodes);
    return arr.reduce((p: number, c: AtomNode) => {
      return p + 1 + sum(get(c).childNodes);
    }, 0);
  };
  return { count: sum(rootNodes) };
});

const TotalCount = () => {
  const { count } = useAtomValue(total);
  return <div>Total: {count}</div>;
};

const NodeValue = ({ value }: { value: AtomNode }) => {
  const val = useAtomValue(value);
  const set = useSetAtom(value);

  return (
    <div>
      <input value={val.text} onChange={(e) => set({ text: e.target.value })} />
    </div>
  );
};

const Node = memo(({ node }: { node: AtomNode }) => {
  const { value, childNodes } = useAtomValue(node);
  return (
    <li>
      <NodeValue value={value} />
      <Nodes nodes={childNodes} />
    </li>
  );
});

const Nodes = ({ nodes }: { nodes: Atom<AtomNode[]> }) => {
  return (
    <ul>
      {useAtomValue(nodes).map((node: AtomNode) => (
        <Node key={`${node}`} node={node} />
      ))}
      <NewNode nodes={nodes} />
    </ul>
  );
};

const NewNode = ({ nodes }: { nodes: Atom<AtomNode[]> }) => {
  const append = useSetAtom(appendNode);
  const [text, setText] = useState("");
  const add = () => {
    append([nodes, { text }]);
    setText("");
  };
  return (
    <li>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter new text..."
      />
      <button disabled={!text} onClick={add}>
        Add
      </button>
    </li>
  );
};

const App = () => (
  <>
    <TotalCount />

    <Nodes nodes={rootNodes} />
  </>
);

export default App;
