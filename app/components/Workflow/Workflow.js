import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import React from 'react';
import DependencyGraph from './DependencyGraph/DependencyGraphEChart';
import DependencyTree from './DependencyTree/DependencyTreeEChart';
import styles from './Workflow.css';

const workflow = props => {
  const [diagram, setDiagram] = React.useState('graph');

  const handleDiagram = (event, newDiagram) => {
    setDiagram(newDiagram);
  };
  const { project } = props;
  let graph = <DependencyGraph assets={project.assets} />;
  if (diagram === 'tree') {
    graph = <DependencyTree assets={project.assets} />;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ToggleButtonGroup
          value={diagram}
          exclusive
          onChange={handleDiagram}
          aria-label="select workflow diagram"
        >
          <ToggleButton value="graph" aria-label="dependency graph">
            Dependency Graph
          </ToggleButton>
          <ToggleButton value="tree" aria-label="dependency tree">
            Tree
          </ToggleButton>
        </ToggleButtonGroup>
        <span className={styles.projectPath}>
          Paths shown relative to project home:
          <br />
          {project.path}
        </span>
      </div>
      {graph}
    </div>
  );
};

export default workflow;
