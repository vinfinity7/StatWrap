/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from 'react-data-table-component';
import Error from '../Error/Error';
import GeneralUtil from '../../utils/general';
import AssetUtil from '../../utils/asset';
import styles from './ProjectNotes.css';

const columns = [
  {
    name: 'Type',
    selector: 'type',
    sortable: true
  },
  {
    name: 'URI',
    selector: 'uri',
    sortable: true,
    grow: 3,
    wrap: true
  },
  {
    name: 'Date/Time',
    selector: 'updated',
    sortable: true
  },
  {
    name: 'Author',
    selector: 'author',
    sortable: true
  },
  {
    name: 'Note',
    selector: 'content',
    sortable: true,
    grow: 3,
    wrap: true
  }
];

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// eslint-disable-next-line react/prop-types
const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search notes"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      <FontAwesomeIcon icon="times" size="sm" />
    </ClearButton>
  </>
);

const projectNotes = props => {
  const [filterText, setFilterText] = React.useState('');
  const [pending, setPending] = useState(true);
  const [feed, setFeed] = useState(null);
  const [error, setError] = useState(null);

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setFilterText('');
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText]);

  useEffect(() => {
    setPending(false);

    if (props.project) {
      let mappedProjectNotes = [];
      if (props.project.notes) {
        mappedProjectNotes = props.project.notes.map(n => {
          return { type: 'Project', updated: n.updated, author: n.author, content: n.content };
        });
      }

      let mappedAssetNotes = [];
      if (props.project.assets) {
        mappedAssetNotes = AssetUtil.getAllNotes(props.project.assets).map(n => {
          return {
            type: 'Asset',
            uri: n.uri,
            updated: n.updated,
            author: n.author,
            content: n.content
          };
        });
      }
      if (mappedAssetNotes.length > 0 || mappedProjectNotes.length > 0) {
        setFeed([...mappedProjectNotes, ...mappedAssetNotes]);
      } else {
        setFeed(null);
      }
      return;
    }
    setFeed(null);
  }, [props.project]);

  let contents = <div className={styles.empty}>There are no notes to show</div>;
  if (feed) {
    const data = feed
      .map(f => {
        return { ...f, datetime: GeneralUtil.formatDateTime(f.timestamp) };
      })
      .filter(
        f =>
          filterText === '' ||
          (f.content && f.content.toLowerCase().includes(filterText.toLowerCase())) ||
          (f.author && f.author.toLowerCase().includes(filterText.toLowerCase())) ||
          (f.uri && f.uri.toLowerCase().includes(filterText.toLowerCase()))
      );
    contents = (
      <DataTable
        title="Notes"
        columns={columns}
        data={data}
        striped
        progressPending={pending}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />
    );
  } else if (error) {
    contents = <Error>There was an error loading the notes: {error}</Error>;
  }
  return <div className={styles.container}>{contents}</div>;
};

projectNotes.propTypes = {
  project: PropTypes.object.isRequired
};

export default projectNotes;
