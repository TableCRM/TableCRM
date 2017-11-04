// configures the enzyme adapter for our tests.
// The disableLifecycleMethods portion is needed to allow us to modify props through different tests

import requestAnimationFrame from './tempPolyfills';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter(), disableLifecycleMethods: true });
