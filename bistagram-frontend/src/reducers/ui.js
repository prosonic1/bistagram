import UI from '../actions/ActionTypes/ui';

const loading = {
  login:false,
  post: false,
  explore: false,
  history: false,
  search: false
}

const initialState = {
  header: true,
  headerModal: false,
  profileImgModal: false,
  logoutModal: false,
  followerModal: false,
  followingModal: false,
  loading: {
    ...loading
  }
}

function ui(state=initialState, action) {
  const payload = action.payload;
  switch (action.type) {

    case UI.SET_HEADER:
      return{
        ...state,
        header: payload
      }

    case UI.SET_HEADER_MODAL:
      return{
        ...state,
        headerModal: !state.headerModal
      }

    case UI.SET_LOADING_INITIAL:
      return{
        ...state,
        loading: {
          ...loading
        }
      }

    case UI.SET_LOADING:
      return{
        ...state,
        loading: {
          ...state.loading,
          [payload.name]: payload.value
        }
      }

    case UI.SET_UI_MODAL:
      return{
        ...state,
        [payload.name]: payload.value
      }

    case UI.SET_FOLLOW_MODAL_INITIAL:
      return{
        ...state,
        followerModal: false,
        followingModal: false
      }

    default:
      return state;
  }
}

export default ui;
