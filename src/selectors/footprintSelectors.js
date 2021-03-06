// we receive values in kgs and convert them to tonnes,
// rounding to 2 decimal places
export const normaliseEmissionValue = (value) => Math.round(value / 10) / 100;

const averageFootprints = (footprints, initFootprint) => {
  const keysParticipant = Object.keys(footprints);
  const weight = 1 / keysParticipant.length;
  const footprintAverage = JSON.parse(JSON.stringify(initFootprint));

  keysParticipant.forEach((key) => {
    const element = footprints[key].footprint;
    if (element.value) {
      footprintAverage.value =
        (footprintAverage.value || 0) + element.value * weight;
    }
    element.children.forEach((sector, i) => {
      footprintAverage.children[i].value =
        (footprintAverage.children[i].value || 0) +
        Math.round(sector.value * weight);
      if (sector.children) {
        sector.children.forEach((categ, j) => {
          footprintAverage.children[i].children[j].value =
            (footprintAverage.children[i].children[j].value || 0) +
            Math.round(categ.value * weight);
        });
      }
    });
  });
  return footprintAverage;
};

export const weightedAverage = (
  participantAverage,
  citizenAverage,
  initFootprint,
  weightParticipant
) => {
  const globalAverage = JSON.parse(JSON.stringify(initFootprint));

  globalAverage.value =
    weightParticipant * participantAverage.value +
    (1 - weightParticipant) * citizenAverage.value;
  if (participantAverage.children) {
    participantAverage.children.forEach((sector, i) => {
      globalAverage.children[i].value = Math.round(
        weightParticipant * sector.value +
          (1 - weightParticipant) * citizenAverage.children[i].value
      );
      if (sector.children) {
        sector.children.forEach((categ, j) => {
          globalAverage.children[i].children[j].value = Math.round(
            (1 - weightParticipant) *
              citizenAverage.children[i].children[j].value +
              weightParticipant * categ.value
          );
        });
      }
    });
  }
  return globalAverage;
};

export const participantsAverageFootprint = (
  carbonFootprints,
  footprintStructure
) => {
  return averageFootprints(carbonFootprints, footprintStructure);
};

export const globalAverageFootprint = (
  carbonFootprints,
  citizenFootprints,
  footprintStructure
) => {
  // const nbParticipants = Object.keys(carbonFootprints).length;
  const initFootprint = JSON.parse(JSON.stringify(footprintStructure));
  const weightParticipant = 0.1;
  // const allFootprints = {};
  const participantAverage = averageFootprints(carbonFootprints, initFootprint);
  const citizenAverage = averageFootprints(citizenFootprints, initFootprint);
  const globalAverage = weightedAverage(
    participantAverage,
    citizenAverage,
    initFootprint,
    weightParticipant
  );
  return globalAverage;
};

export const participantFootprint = (
  carbonFootprints,
  participantId,
  currentRound
) => {
  const participantKey = `${toString(currentRound)}-${toString(participantId)}`;
  return carbonFootprints[participantKey].footprint;
};

export const footprintDataToGraph = (footprintData) => {
  const footprintArray = [];

  footprintData.children.forEach((sectorData) => {
    const sectorObject = { name: sectorData.name };
    sectorData.children.forEach((categData) => {
      sectorObject[categData.name] = normaliseEmissionValue(categData.value);
    });
    footprintArray.push(sectorObject);
  });
  return footprintArray;
};

export const computeEvolutionGraph = (
  roundsEntity,
  carbonFootprintsEntity,
  citizenFootprintsEntity,
  footprintStructure
) => {
  return Object.keys(roundsEntity).map((roundKey) => {
    const roundCarbonFootprints = {};
    const roundEntity = roundsEntity[roundKey];
    const carbonFootprintsPerYear = { year: roundEntity.year };
    const { carbonFootprints = [], citizenCarbonFootprints = [] } = roundEntity;
    carbonFootprints.forEach((carbonFootprintKey) => {
      roundCarbonFootprints[carbonFootprintKey] =
        carbonFootprintsEntity[carbonFootprintKey];
      const playerId = carbonFootprintsEntity[carbonFootprintKey].participantId;
      carbonFootprintsPerYear[playerId] = normaliseEmissionValue(
        carbonFootprintsEntity[carbonFootprintKey].footprint.value
      );
    });
    const roundCitizenFootprints = citizenCarbonFootprints.reduce(
      (accumulator, key) => ({
        ...accumulator,
        [key]: citizenFootprintsEntity[key],
      }),
      {}
    );
    carbonFootprintsPerYear.avg_participants = normaliseEmissionValue(
      participantsAverageFootprint(roundCarbonFootprints, footprintStructure)
        .value
    );
    carbonFootprintsPerYear.avg_global = normaliseEmissionValue(
      globalAverageFootprint(
        roundCarbonFootprints,
        roundCitizenFootprints,
        footprintStructure
      ).value
    );
    return carbonFootprintsPerYear;
  });
};
// var total footptints : récupérer les totaux ds footprint à partir de ceux du rounds
// var = {year: round.year, round.carbonFootprints.forEach(key=> key.split("-")[1]: state.carbonFootprints[key].footprint.value) }
