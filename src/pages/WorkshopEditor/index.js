import 'jsoneditor-react/es/editor.min.css';
import Ajv from 'ajv';
import React from 'react';
import { Container } from 'react-bootstrap';
import { JsonEditor as Editor } from 'jsoneditor-react';

import Loading from '../../components/Loading';
import { denormalizeWorkshopWithoutClean } from '../../utils/api';
import { useWorkshop } from '../../hooks/workshop';

const WorkshopEditor = ({
  match: {
    params: { workshopId },
  },
}) => {
  const workshop = useWorkshop(workshopId);
  const { loadError, isLoading } = workshop;
  const denormalizedWorkshop = denormalizeWorkshopWithoutClean(workshop);
  const ajv = new Ajv({ allErrors: true, verbose: true });

  return (
    <Loading loadError={loadError} isLoading={isLoading}>
      <Container>
        <Editor
          value={denormalizedWorkshop}
          // onChange={this.handleChange}
          ajv={ajv}
          // schema={schema}
        />
      </Container>
    </Loading>
  );
};

export default WorkshopEditor;
