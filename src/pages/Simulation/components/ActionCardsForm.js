import { Button, Col, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import styled from 'styled-components';

import { ActionCardItem } from './ActionCardItem';
import { COLORS } from '../../../vars';

const ActionCardsForm = ({
  handleSubmit,
  handleCardActionSelectionChange,
  handleCheckedActionCard,
  roundIds,
}) => {
  const { t } = useTranslation();
  const actionCardBatchesEntity = useSelector(
    (state) => state.workshop.entities.actionCardBatches
  );
  const actionCardsEntity = useSelector(
    (state) => state.workshop.entities.actionCards
  );
  const roundsConfigEntity = useSelector(
    (state) => state.workshop.entities.roundsConfig
  );
  // initial active == expanded lot is the last lot of the current round
  const [activeBatch, setActiveBatch] = useState(
    roundsConfigEntity[
      Object.keys(roundsConfigEntity).slice(-1)[0]
    ].actionCardBatchIds.slice(-1)[0]
  );

  return (
    <Form noValidate>
      <Form.Row>
        {roundIds.map((roundConfigId) =>
          roundsConfigEntity[roundConfigId].actionCardBatchIds.map(
            (actionCardBatchId) => {
              const {
                name: actionCardBatchName,
                actionCardIds,
              } = actionCardBatchesEntity[actionCardBatchId];
              return (
                <Form.Group
                  as={Col}
                  sm={actionCardBatchId === activeBatch ? '5' : '2'}
                  key={actionCardBatchId}
                >
                  <BatchBadge
                    text={actionCardBatchName}
                    active={actionCardBatchId === activeBatch}
                    handleClick={() => setActiveBatch(actionCardBatchId)}
                  />
                  {actionCardIds.map((actionCardId) => {
                    const {
                      name: actionCardName,
                      cardNumber,
                    } = actionCardsEntity[actionCardId];
                    return (
                      <ActionCardItem
                        key={actionCardId}
                        id={cardNumber}
                        text={actionCardName}
                        category={actionCardsEntity[actionCardId].subCategory}
                        active={actionCardBatchId === activeBatch}
                        checked={handleCheckedActionCard(actionCardId)}
                        cost={actionCardsEntity[actionCardId].cost}
                        handleChange={() =>
                          handleCardActionSelectionChange(actionCardId)
                        }
                      />
                    );
                  })}
                </Form.Group>
              );
            }
          )
        )}
      </Form.Row>
      <Form.Row className="d-flex justify-content-end">
        <Button onClick={handleSubmit}>{t('common.validate')}</Button>
      </Form.Row>
    </Form>
  );
};

const BatchBadge = ({ id, text, active, handleClick }) => {
  return (
    <StyledBatch
      name={id}
      className="m-1 mb-3 p-1 btn-block text-center btn"
      active={active}
      onClick={() => {
        handleClick();
      }}
    >
      {text}
    </StyledBatch>
  );
};

const StyledBatch = styled.div`
cursor: pointer;
color: black;
/* font-size: 0.7rem; */
/* border: ${(props) =>
  props.selected ? '3pt solid palegreen' : '3pt solid white'}; */
background: ${(props) =>
  props.active ? COLORS.PRIMARY : COLORS.GRAY.STANDARD};
`;

const StyledButton = styled(Button);
export default ActionCardsForm;
