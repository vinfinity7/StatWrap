/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
  FaPaperclip,
  FaFilter
} from 'react-icons/fa';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AssetUtil from '../../../utils/asset';
import Constants from '../../../constants/constants';

// This implementation borrows heavily from: https://github.com/davidtran/simple-treeview
// Many thanks to davidtran for the implementation to get us started!

const getPaddingLeft = level => {
  return level * 20;
};

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${props => getPaddingLeft(props.level)}px;
  ${props => (props.selected ? 'background-color: #eee;' : null)}
`;

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 5)}px;
`;

const StyledInput = styled.input`
  margin-right: 5px;
`;

const AssetNode = props => {
  const {
    node,
    root,
    openNodes,
    checkedNodes,
    selectedAsset,
    level,
    checkboxes,
    onToggle,
    onRightClick,
    onClick
  } = props;
  const isOpen = root || openNodes.includes(node.uri);
  const isChecked = checkboxes && (root || checkedNodes.includes(node.uri));
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(checkboxes && checkedNodes.includes(node.uri));
  }, [checkedNodes]);

  const handleChecked = () => {
    setChecked(prevState => {
      if (props.onCheck) {
        props.onCheck(props.node, !prevState);
      }

      return !prevState;
    });
  };

  // Allow checkboxes if the checkbox mode is turned on, but not for the root node.  We don't have a really
  // good way to handle the root node - especially when the root node is a dummy/placeholder node.
  const checkbox =
    !root && checkboxes ? (
      <StyledInput checked={checked} onChange={handleChecked} type="checkbox" />
    ) : null;
  return (
    <>
      <StyledTreeNode
        level={level}
        type={node.type}
        selected={node && selectedAsset && node.uri === selectedAsset.uri}
        onContextMenu={e => {
          if (onRightClick) {
            onRightClick(e);
          }
        }}
        onClick={e => {
          e.stopPropagation();
          if (onClick) {
            onClick(node);
          }
        }}
      >
        <NodeIcon onClick={() => onToggle(node)}>
          {node.type === Constants.AssetType.DIRECTORY &&
            (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>
        {checkbox}
        <NodeIcon marginRight={10}>
          {node.type === Constants.AssetType.FILE && <FaFile />}
          {node.type === Constants.AssetType.DIRECTORY && isOpen === true && <FaFolderOpen />}
          {node.type === Constants.AssetType.DIRECTORY && !isOpen && <FaFolder />}
          {node.type === Constants.AssetType.ASSET_GROUP && <FaPaperclip />}
          {node.type === Constants.AssetType.FILTER && <FaFilter />}
        </NodeIcon>

        <span role="button">{AssetUtil.getAssetNameFromUri(node)}</span>
      </StyledTreeNode>

      {isOpen &&
        (!node.children
          ? null
          : node.children.map(childNode => (
              <AssetNode
                key={childNode.uri}
                node={childNode}
                level={level + 1}
                selectedAsset={selectedAsset}
                openNodes={openNodes}
                checkedNodes={checkedNodes}
                onToggle={onToggle}
                onClick={onClick}
                onRightClick={onRightClick}
                checkboxes={checkboxes}
                onCheck={props.onCheck}
              />
            )))}
    </>
  );
};

AssetNode.propTypes = {
  node: PropTypes.object.isRequired,
  root: PropTypes.bool,
  selectedAsset: PropTypes.object,
  level: PropTypes.number,
  onToggle: PropTypes.func,
  onRightClick: PropTypes.func,
  onClick: PropTypes.func,
  onCheck: PropTypes.func,
  openNodes: PropTypes.array,
  checkedNodes: PropTypes.array,
  checkboxes: PropTypes.bool
};

AssetNode.defaultProps = {
  root: false,
  onToggle: null,
  onRightClick: null,
  onClick: null,
  onCheck: null,
  level: 0,
  selectedAsset: null,
  openNodes: [],
  checkedNodes: [],
  checkboxes: false
};

export default AssetNode;
