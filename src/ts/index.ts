
import { Maybe } from './Maybe';

const yes = Maybe.of(5);

const whatIsThis = Maybe.caseOf(yes)({
  just: myNumber => 6,
  nothing: () => 0
});

//Math.max(2, whatIsThis);
