import * as Types from '../constants/ActionTypes';

const initialState = {
  data: {},
  dataStatus: null,
  config: {},
  configStatus: null

};

let allDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_BOARD_WORK_ALLDATA:
      return {
        ...state,
        dataStatus: action.status,
        data: action.allData
      };
    case Types.FETCH_RAPID_VIEWS_CONFIG:
      return {
        ...state,
        configStatus: action.status,
        config: action.config
      };
    default:
      return state
  }
}

export default allDataReducer;