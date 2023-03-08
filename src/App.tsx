import { forwardRef, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DoneIcon from "@mui/icons-material/Done";
import { TextField, IconButton, Box } from "@mui/material";
import TreeItem, {
  TreeItemProps,
  useTreeItem,
  TreeItemContentProps,
} from "@mui/lab/TreeItem";
import clsx from "clsx";

const CustomContent = forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);
  const [disable, setDisable] = useState(disabled);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleSelection(event);
  };
  if (!label) return null;
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disable,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
        {!expansionIcon && (
          <IconButton onClick={() => setDisable((prev) => !prev)}>
            <DoneIcon />
          </IconButton>
        )}
      </div>
      <TextField
        onClick={handleSelectionClick}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            console.log("tacseta");
          }
        }}
        className={classes.label}
        disabled={disable}
        defaultValue={label.content}
        variant="standard"
        sx={{ textDecoration: disable ? "line-through" : "none" }}
      ></TextField>
      <TextField
        onClick={handleSelectionClick}
        disabled={disable}
        defaultValue={label.value}
        variant="standard"
        type="tel"
        sx={{
          width: "4rem",
          textDecoration: disable ? "line-through" : "none",
          "&::after": {
            position: "absolute",
            content: '"%"',
            display: "inline",
            left: "1.8rem",
            top: "0.2rem",
          },
        }}
      ></TextField>
    </div>
  );
});

function CustomTreeItem(props: TreeItemProps) {
  return (
    <TreeItem ContentComponent={CustomContent} {...props} disabled={false} />
  );
}

type NodeState = {
  content: string;
  value: number;
  disable: boolean;
};

type Node = {
  id: string;
  state: NodeState;
  children?: Node[];
};

function renderNode(node: Node) {
  return (
    <CustomTreeItem
      nodeId={node.id}
      label={{ content: node.state.content, value: node.state.value }}
    >
      {node.children && node.children.map((child) => renderNode(child))}
    </CustomTreeItem>
  );
}

export default function IconExpansionTreeView() {
  //zustandを使う実装にする
  const [node, setNode] = useState({
    id: "1",
    state: {
      content: "Root",
      value: 10,
      disable: false,
    },
    children: [
      {
        id: "2",
        state: {
          content: "Child 1",
          value: 20,
          disable: false,
        },
        children: [
          {
            id: "3",
            state: {
              content: "Child 1.1",
              value: 30,
              disable: false,
            },
          },
        ],
      },
    ],
  });
  return (
    <TreeView
      aria-label="icon expansion"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 400, flexGrow: 1, width: 400, overflowY: "auto" }}
    >
      {renderNode(node)}
    </TreeView>
  );
}
