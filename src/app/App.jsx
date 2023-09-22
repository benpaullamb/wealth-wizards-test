/** @jsx jsx */
import { jsx } from '@emotion/react';
import './index.css';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Home from './Home';

const App = ({ store }) => (
  <Provider store={store}>
    <Home />
  </Provider>
);

App.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
