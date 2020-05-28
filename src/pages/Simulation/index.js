import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import footprintData from '../../utils/mocks/footprintData';
import {
  footprintDataToGraph,
  currentRound,
} from '../../selectors/footprintSelectors';
import './components/simulationPage.css';
import { useWorkshop } from '../../hooks/workshop';
import NavbarWorkshop from '../../components/NavbarWorkshop';
import FootprintGraphType from './components/FootprintGraphType';
import EvolutionCarbon from './components/EvolutionCarbon';
import CommonModal from '../../components/CommonModal';
import { startRound, retrieveWorkshop } from '../../actions/workshop';
import NewRoundModalForm from './components/NewRoundModalForm';
import IndividualActions from './components/IndividualActions';

const Simulation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { entities, result, isLoading, loadError } = useWorkshop(1);
  console.log('entities', entities);
  console.log('result', result);
  // NewRoundModal
  const [showNewRoundModal, setShowNewRoundModal] = useState(false);
  const handleCloseNewRoundModal = () => setShowNewRoundModal(false);
  const handleSubmitNewRoundModal = (values) => {
    dispatch(startRound(values));
    setShowNewRoundModal(false);
    setShowEntryOfIndividualActions(true);
  };
  const handleShowNewRoundModal = () => setShowNewRoundModal(true);
  // EntryOfIndividualActions
  const [
    showEntryOfIndividualActions,
    setShowEntryOfIndividualActions,
  ] = useState(false);
  const handleCloseEntryOfIndividualActions = () =>
    setShowEntryOfIndividualActions(false);

  // const footprintShaped = useSelector((state) =>
  //   footprintDataToGraph(
  //     state.workshop.entities.carbonFootprints['2020-1'].footprint
  //   )
  // );

  return (
    <React.Fragment>
      <NavbarWorkshop
        avatarUrl="https://img.icons8.com/doodle/48/000000/user.png"
        firstName="Xavier"
        role="Animateur"
      />
      <StyledSimulation>
        <Container className="row-full">
          <Row className="d-flex justify-content-end mr-1">
            <Button variant="secondary" onClick={handleShowNewRoundModal}>
              {t('common.nextRound')}
            </Button>
          </Row>
          {loadError && <p>{t('common.loadError')}</p>}
          {isLoading && (
            <Spinner animation="border" className="pt-3 mx-auto mt-5" />
          )}
          {!isLoading && (
            <Row style={{ height: '100vh' }}>
              <Col sm={12} md={7} className="graph-col">
                <Container className="graph-card">
                  <h4>
                    Evolution du CO<span style={{ fontSize: '14px' }}>2</span>{' '}
                    par personne
                  </h4>
                  <EvolutionCarbon data={evolutionData} />
                </Container>
              </Col>
              <Col sm={12} md={5} className="graph-col">
                <Container className="graph-card">
                  <h4> Moyenne nationale </h4>
                  <FootprintGraphType type="globalAverage" />
                </Container>
                <Container className="graph-card">
                  <h4> Les participants </h4>
                  <FootprintGraphType type="participantsAverage" />
                </Container>
              </Col>
            </Row>
          )}
        </Container>
      </StyledSimulation>
      <CommonModal
        title={t('common.nextRound')}
        show={showNewRoundModal}
        handleClose={handleCloseNewRoundModal}
      >
        <NewRoundModalForm handleSubmit={handleSubmitNewRoundModal} />
      </CommonModal>
      <CommonModal
        title={t('common.entryOfIndividualActions')}
        show={showEntryOfIndividualActions}
        handleClose={handleCloseEntryOfIndividualActions}
      >
        <IndividualActions handleClose={handleCloseEntryOfIndividualActions} />
      </CommonModal>
    </React.Fragment>
  );
};

const StyledSimulation = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  margin: 10px 0;
`;
const StyledHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;
// const currentRound = "2020-1";
//
const evolutionData = [
  {
    year: 2020,
    player1: 17000,
    player2: 14000,
    player3: 10000,
    player4: 9000,
    player5: 5000,
    player6: 4500,
    player7: 8500,
    player8: 7000,
    player9: 6000,
  },
  {
    year: 2025,
    player1: 14000,
    player2: 12000,
    player3: 10000,
    player4: 7000,
    player5: 5000,
    player6: 4000,
    player7: 7500,
    player8: 4000,
    player9: 4000,
  },
  {
    year: 2030,
    player1: 14000,
    player2: 12000,
    player3: 10000,
    player4: 7000,
    player5: 5000,
    player6: 4000,
    player7: 7500,
    player8: 4000,
    player9: 4000,
  },
  {
    year: 2033,
    player1: 12000,
    player2: 10000,
    player3: 8000,
    player4: 7000,
    player5: 6000,
    player6: 2500,
    player7: 7000,
    player8: 3000,
    player9: 2000,
  },
  {
    year: 2040,
    player1: 8000,
    player2: 7000,
    player3: 5000,
    player4: 4000,
    player5: 5000,
    player6: 2500,
    player7: 7000,
    player8: 3000,
    player9: 2000,
  },
  {
    year: 2050,
    player1: 4000,
    player2: 3000,
    player3: 2000,
    player4: 2000,
    player5: 2000,
    player6: 2500,
    player7: 4000,
    player8: 3000,
    player9: 2000,
  },
];

export default Simulation;
