export const INIT_WORKSHOP = 'INIT_WORKSHOP';
export const START_ROUND = 'START_ROUND';
export const SET_INDIVIDUAL_ACTIONS = 'SET_INDIVIDUAL_ACTIONS';
export const SET_INDIVIDUAL_ACTIONS_FOR_ALL_PARTICIPANTS =
  'SET_INDIVIDUAL_ACTIONS_FOR_ALL_PARTICIPANTS';
export const SET_COLLECTIVE_ACTIONS = 'SET_COLLECTIVE_ACTIONS';
export const COMPUTE_FOOTPRINT = 'COMPUTE_FOOTPRINT';
export const APPLY_INDIVIDUAL_ACTION = 'APPLY_INDIVIDUAL_ACTION';
export const WORKSHOP_RETRIEVED = 'WORKSHOP_RETRIEVED';
export const RETRIEVE_WORKSHOP = 'RETRIEVE_WORKSHOP';
export const WORKSHOP_LOAD_ERROR = 'WORKSHOP_LOAD_ERROR';
export const COMPUTE_CARBON_VARIABLES = 'COMPUTE_CARBON_VARIABLES';
export const APPLY_INDIVIDUAL_ACTIONS = 'APPLY_INDIVIDUAL_ACTIONS';
export const APPLY_COLLECTIVE_ACTIONS = 'APPLY_COLLECTIVE_ACTIONS';
export const COMPUTE_FOOTPRINTS = 'COMPUTE_FOOTPRINTS';
export const INIT_ROUND = 'INIT_ROUND';
export const SET_ACTIONS_FOR_CITIZENS = 'SET_ACTIONS_FOR_CITIZENS';
export const COMPUTE_FOOTPRINTS_FOR_CITIZENS =
  'COMPUTE_FOOTPRINTS_FOR_CITIZENS';
export const APPLY_INDIVIDUAL_ACTIONS_FOR_CITIZENS =
  'APPLY_INDIVIDUAL_ACTIONS_FOR_CITIZENS';
export const APPLY_COLLECTIVE_ACTIONS_FOR_CITIZENS =
  'APPLY_COLLECTIVE_ACTIONS_FOR_CITIZENS';
export const APPLY_SOCIAL_IMPACT = 'APPLY_SOCIAL_IMPACT';

export const initWorkshop = (year) => ({
  type: INIT_WORKSHOP,
  payload: { year },
});

export const startRound = (payload) => ({
  type: START_ROUND,
  payload,
});

export const setIndividualActions = (
  year,
  participantId,
  individualActionCardIds
) => ({
  type: SET_INDIVIDUAL_ACTIONS,
  payload: { year, participantId, individualActionCardIds },
});

export const setIndividualActionsForAllParticipants = (
  year,
  individualActionCards
) => ({
  type: SET_INDIVIDUAL_ACTIONS_FOR_ALL_PARTICIPANTS,
  payload: { year, individualActionCards },
});

export const setCollectiveActions = (year, collectiveActionCards) => ({
  type: SET_COLLECTIVE_ACTIONS,
  payload: { year, collectiveActionCards },
});

export const workshopRetrieved = (workshop) => ({
  type: WORKSHOP_RETRIEVED,
  payload: { workshop },
});

export const retrieveWorkshop = () => ({
  type: RETRIEVE_WORKSHOP,
  payload: [],
});

export const workshopLoadError = (error) => ({
  type: WORKSHOP_LOAD_ERROR,
  payload: error,
});

export const initRound = (year) => ({
  type: INIT_ROUND,
  payload: { year },
});

export const computeCarbonVariables = (participantId) => ({
  type: COMPUTE_CARBON_VARIABLES,
  payload: { participantId },
});

export const applyIndividualActions = (year) => ({
  type: APPLY_INDIVIDUAL_ACTIONS,
  payload: { year },
});

export const applyCollectiveActions = (year) => ({
  type: APPLY_COLLECTIVE_ACTIONS,
  payload: { year },
});

export const computeFootprints = (year) => ({
  type: COMPUTE_FOOTPRINTS,
  payload: { year },
});

export const setActionsForCitizens = (year) => ({
  type: SET_ACTIONS_FOR_CITIZENS,
  payload: { year },
});

export const computeFootprintsForCitizen = (year) => ({
  type: COMPUTE_FOOTPRINTS_FOR_CITIZENS,
  payload: { year },
});

export const applyIndivdualActionsForCitizens = (year) => ({
  type: APPLY_INDIVIDUAL_ACTIONS_FOR_CITIZENS,
  payload: { year },
});

export const applyCollectiveActionsForCitizens = (year) => ({
  type: APPLY_COLLECTIVE_ACTIONS_FOR_CITIZENS,
  payload: { year },
});

export const applySocialImpact = (year) => ({
  type: APPLY_SOCIAL_IMPACT,
  payload: { year },
});

export const initRoundAndProcessModel = (yearFrom, yearTo) => {
  return (dispatch) => {
    dispatch(initRound(yearTo));
    dispatch(applyIndividualActions(yearFrom));
    dispatch(applyCollectiveActions(yearFrom));
    dispatch(setActionsForCitizens(yearTo));
    dispatch(applySocialImpact(yearTo));
    dispatch(applyIndivdualActionsForCitizens(yearTo));
    dispatch(applyCollectiveActionsForCitizens(yearTo));
    dispatch(computeFootprints(yearTo));
    dispatch(computeFootprintsForCitizen(yearTo));
  };
};
