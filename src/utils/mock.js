import coaches from './mocks/coaches';
import participants from './mocks/participants';
import personas from './mocks/personas';
// import workshop from './mocks/emptyWorkshop.json';
import workshop1 from './mocks/initializedWorkshop.json';
import workshop2 from './mocks/initializedWorkshop2.json';
import workshops from './mocks/workshops';

const fullWorkshops = { [workshop1.id]: workshop1, [workshop2.id]: workshop2 };

export default {
  [`/ping`]: 'pong',
  [`/coaches`]: coaches,
  // [`/workshop`]: workshop,
  [`/workshops/*`]: ({ workshopId }) => fullWorkshops[workshopId],
  [`/workshops`]: workshops,
  [`/participants`]: participants,
  [`/personas`]: personas,
};
