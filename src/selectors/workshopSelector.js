import { pathOr } from 'ramda';

import { makeYearParticipantKey, sumArray } from '../utils/helpers';

export const selectIndividualChoicesForParticipant = (
  participantId,
  roundConfigEntity,
  individualChoicesEntity
) =>
  individualChoicesEntity
    ? [
        ...new Set(
          Object.keys(roundConfigEntity).reduce(
            (accumulator, year) =>
              roundConfigEntity[year].actionCardType === 'individual' &&
              individualChoicesEntity[
                makeYearParticipantKey(year, participantId)
              ]
                ? accumulator.concat(
                    individualChoicesEntity[
                      makeYearParticipantKey(year, participantId)
                    ].actionCardIds
                  )
                : accumulator,
            []
          )
        ),
      ]
    : [];

export const selectCollectiveChoices = (
  roundConfigEntity,
  collectiveChoicesEntity
) =>
  collectiveChoicesEntity
    ? [
        ...new Set(
          Object.keys(roundConfigEntity).reduce(
            (accumulator, year) =>
              roundConfigEntity[year].actionCardType === 'collective' &&
              collectiveChoicesEntity[year]
                ? accumulator.concat(
                    collectiveChoicesEntity[year].actionCardIds
                  )
                : accumulator,
            []
          )
        ),
      ]
    : [];

const selectCheckedActionCardsBatchIdsFromRounds = (
  workshop,
  actionCardType
) => {
  const roundConfigEntity = pathOr([], ['entities', 'roundConfig'], workshop);
  return [
    ...new Set(
      Object.keys(roundConfigEntity).reduce(
        (accumulator, roundConfigId) =>
          roundConfigEntity[roundConfigId].actionCardBatchIds &&
          (!actionCardType ||
            actionCardType === roundConfigEntity[roundConfigId].actionCardType)
            ? accumulator.concat(
                roundConfigEntity[roundConfigId].actionCardBatchIds.filter(
                  // Remove null elements with filtering
                  (e) => e
                )
              )
            : accumulator,
        []
      )
    ),
  ];
};

export const selectCheckedIndividualActionCardsBatchIdsFromRounds = (
  workshop
) => selectCheckedActionCardsBatchIdsFromRounds(workshop, 'individual');

export const selectCheckedCollectiveActionCardsBatchIdsFromRounds = (
  workshop
) => selectCheckedActionCardsBatchIdsFromRounds(workshop, 'collective');

export const selectCurrentRound = (workshop) =>
  pathOr(null, ['result', 'currentYear'], workshop);

export const selectNextRound = (workshop) => {
  const config = workshop.entities.roundConfig[workshop.result.currentYear];
  return config ? config.targetedYear : null;
};

export const selectIndividualRoundIds = (roundConfigEntity) =>
  Object.keys(roundConfigEntity).filter(
    (roundConfigId) =>
      roundConfigEntity[roundConfigId].actionCardType === 'individual'
  );

export const selectCollectiveRoundIds = (roundConfigEntity) =>
  Object.keys(roundConfigEntity).filter(
    (roundConfigId) =>
      roundConfigEntity[roundConfigId].actionCardType === 'collective'
  );

export const getNumberOfChosenActionCards = (
  individualChoicesEntity,
  round,
  participantId
) => {
  if (!individualChoicesEntity) return 0;
  const participantChoicesId = makeYearParticipantKey(round, participantId);
  return individualChoicesEntity[participantChoicesId] &&
    individualChoicesEntity[participantChoicesId].actionCardIds
    ? individualChoicesEntity[participantChoicesId].actionCardIds.length
    : 0;
};

export const getNumberOfChosenCollectiveCards = (
  collectiveChoicesEntity,
  round
) => {
  return collectiveChoicesEntity &&
    collectiveChoicesEntity[round] &&
    collectiveChoicesEntity[round].actionCardIds
    ? collectiveChoicesEntity[round].actionCardIds.length
    : 0;
};

export const getCostOfChosenActionCards = (
  individualChoicesEntity,
  actionCardsEntity,
  round,
  participantId
) => {
  if (!individualChoicesEntity) return 0;
  const id = makeYearParticipantKey(round, participantId);
  return actionCardsEntity &&
    individualChoicesEntity[id] &&
    individualChoicesEntity[id].actionCardIds
    ? sumArray(
        individualChoicesEntity[id].actionCardIds.map(
          (cardId) => actionCardsEntity[cardId].cost
        )
      )
    : 0;
};

export const getCostOfChosenCollectiveCards = (
  collectiveChoicesEntity,
  actionCardsEntity,
  round
) => {
  if (!collectiveChoicesEntity) return 0;
  return actionCardsEntity &&
    collectiveChoicesEntity[round] &&
    collectiveChoicesEntity[round].actionCardIds
    ? sumArray(
        collectiveChoicesEntity[round].actionCardIds.map(
          (cardId) => actionCardsEntity[cardId].cost
        )
      )
    : 0;
};

// computes number of hearts = budget per participant at the beginning of each round
export const getInitRoundBudget = (
  roundConfigEntity,
  inidividualChoicesEntity,
  participantIds,
  actionCardsEntity
) => {
  const rounds = Object.keys(roundConfigEntity);
  const individualRounds = rounds.filter(
    (round) => roundConfigEntity[round].actionCardType === 'individual'
  );
  const roundBudgets = individualRounds.map(
    (round) => roundConfigEntity[round].individualBudget
  );
  const totalBudget = sumArray(roundBudgets);
  const initBudgets = {};
  participantIds.forEach((id) => {
    initBudgets[id] = totalBudget;
  });
  rounds.forEach((round) => {
    participantIds.forEach((id) => {
      const cardIds = inidividualChoicesEntity
        ? inidividualChoicesEntity[makeYearParticipantKey(round, id)]
        : null;
      cardIds &&
        cardIds.actionCardIds.forEach((cardId) => {
          initBudgets[id] -= actionCardsEntity[cardId].cost;
        });
    });
  });
  return initBudgets;
};

export const getDefaultRoundType = (roundConfigEntity, currentYear) => {
  if (!roundConfigEntity) return 'individual';
  const rounds = Object.keys(roundConfigEntity).filter(
    (round) => round !== currentYear // currentYear could be number
  );
  // eslint-disable-next-line no-nested-ternary
  return rounds.length > 0
    ? roundConfigEntity[rounds.slice(-1)[0]].actionCardType === 'individual'
      ? 'collective'
      : 'individual'
    : 'individual';
};
export const getInitRoundBudgetCollective = (
  roundConfigEntity,
  collectiveChoicesEntity,
  actionCardsEntity
) => {
  const rounds = Object.keys(roundConfigEntity);
  const collectiveRounds = rounds.filter(
    (round) => roundConfigEntity[round].actionCardType === 'collective'
  );
  const roundBudgets = collectiveRounds
    ? collectiveRounds.map((round) => roundConfigEntity[round].budget)
    : [0];
  let totalBudget = sumArray(roundBudgets);
  rounds.forEach((round) => {
    const cardIds = collectiveChoicesEntity
      ? collectiveChoicesEntity[round]
      : null;
    cardIds &&
      cardIds.actionCardIds.forEach((cardId) => {
        totalBudget -= actionCardsEntity[cardId].cost;
      });
  });
  return totalBudget;
};

export const selectWorkshopById = (workshops, workshopId) =>
  workshops.find((workshop) => workshop.id === workshopId);

const selectWorkshopEntity = (workshop, entity) =>
  pathOr({}, ['entities', entity], workshop);

export const selectRoundsEntity = (workshop) =>
  selectWorkshopEntity(workshop, 'rounds');

export const selectCarbonFootprintsEntity = (workshop) =>
  selectWorkshopEntity(workshop, 'carbonFootprints');

export const selectParticipantsEntity = (workshop) =>
  selectWorkshopEntity(workshop, 'participants');

export const selectCitizenCarbonFootprintsEntity = (workshop) =>
  selectWorkshopEntity(workshop, 'citizenCarbonFootprints');

const selectWorkshopModelStructure = (workshop, structure) =>
  pathOr({}, ['result', 'model', structure], workshop);

export const selectFootprintStructure = (workshop) =>
  selectWorkshopModelStructure(workshop, 'footprintStructure');

export const selectIsWorkshopReadyForInitialization = (workshop) => {
  const participants = selectParticipantsEntity(workshop);

  const participantIds = pathOr([], ['result', 'participants'], workshop);
  if (participantIds.length === 0) return false;
  return participantIds.every(
    (participantId) =>
      pathOr('notready', [participantId, 'status'], participants) === 'ready'
  );
};
