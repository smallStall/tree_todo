import { memo, useState } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import type { Atom, WritableAtom } from "jotai";

type Label = {
  text: string;
  achieveRate: number;
  done: boolean;
};

type Node = {
  label: Label;
  value: AtomNode & { init: { label: Label } };
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
      return p + get(c).value.init.label.achieveRate + sum(get(c).childNodes);
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
  console.log({ val });
  return (
    <div>
      <input
        value={val.label.text}
        onChange={(e) =>
          set({
            label: { ...val.label, text: e.target.value },
          })
        }
      />
      <input
        value={val.label.achieveRate}
        onChange={(e) =>
          set({ label: { ...val.label, achieveRate: Number(e.target.value) } })
        }
        placeholder="%"
      />
      <input
        type="checkbox"
        checked={val.label.done}
        onChange={(e) =>
          set({ label: { ...val.label, done: e.target.checked } })
        }
      />
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
  const [achieveRate, setAchieveRate] = useState(100);
  const [done, setDone] = useState(false);
  const add = () => {
    append([nodes, { label: { text, achieveRate, done: false } }]);
    setText("");
  };
  return (
    <li>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter new text..."
      />
      <input
        value={achieveRate}
        onChange={(e) => setAchieveRate(Number(e.target.value))}
        placeholder="%"
      />
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => setDone(e.target.checked)}
        placeholder="%"
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
