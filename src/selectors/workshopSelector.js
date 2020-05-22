import { makeYearParticipantKey } from '../utils/helpers';

export const selectIndividualActionCardsFromParticipant = (
  participantId,
  roundsConfigEntity,
  individualActionCardsEntity
) =>
  individualActionCardsEntity
    ? [
        ...new Set(
          Object.keys(roundsConfigEntity).reduce(
            (accumulator, year) =>
              roundsConfigEntity[year].actionCardType === 'individual' &&
              individualActionCardsEntity[
                makeYearParticipantKey(year, participantId)
              ]
                ? accumulator.concat(
                    individualActionCardsEntity[
                      makeYearParticipantKey(year, participantId)
                    ].actionCardIds
                  )
                : accumulator,
            []
          )
        ),
      ]
    : [];

export const getNumberOfTakenActionCards = (
  individualActionCardsEntity,
  round,
  participantId
) => {
  const individualActionCardsId = `${round}-${participantId}`;
  return individualActionCardsEntity[individualActionCardsId] &&
    individualActionCardsEntity[individualActionCardsId].actionCardIds
    ? individualActionCardsEntity[individualActionCardsId].actionCardIds.length
    : 0;
};
export const selectCheckedActionCardsBatchesFromRounds = (roundsConfigEntity) =>
  Object.keys(roundsConfigEntity).reduce(
    (accumulator, roundConfigId) =>
      roundsConfigEntity[roundConfigId].actionCardBatchIds
        ? accumulator.concat(
            roundsConfigEntity[roundConfigId].actionCardBatchIds
          )
        : accumulator,
    []
  );
