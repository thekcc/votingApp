import axios from 'axios';

// Actions
const FETCHED_POLLS = 'polls/FETCHED_POLLS';
const ADD_POLL = 'polls/ADD_POLL';
const ADD_EDIT_POLL = 'polls/ADD_EDIT_POLL';
const DELETE_POLL = 'polls/DELETE_POLL';
const UPDATE_VOTES = 'polls/UPDATE_VOTES';

// reducer
export default function Polls(state = [], action) {
  switch (action.type) {
    case FETCHED_POLLS:
      return action.polls;
    case ADD_POLL: {
      return [
        ...state,
        {
          question: action.question,
          answers: action.answers,
        },
      ];
    }
    case ADD_EDIT_POLL: {
      const addEditPoll = state.polls.map((poll, ind) => {
        if (ind === action.questionInd) {
          return {
            ...poll,
            answers: poll.answers.concat(action.answers),
          };
        }

        return poll;
      });
      return {
        ...state,
        polls: addEditPoll,
      };
    }
    case DELETE_POLL: {
      const removeQuestionList = [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1),
      ];
      return removeQuestionList;
    }
    case UPDATE_VOTES: {
      const updateVotesList = state.polls.map((poll, ind) => {
        if (ind === action.question) {
          return {
            ...poll,
            answers: poll.answers.map((ans, index) => {
              if (index === action.index) {
                return { ...ans, votes: ans.votes + action.votes };
              }
              return ans;
            }),
          };
        }
        return poll;
      });
      return {
        ...state,
        polls: updateVotesList,
      };
    }
    default:
      return state;
  }
}

// actionCreators
function receivePolls(polls) {
  return {
    type: FETCHED_POLLS,
    polls,
  };
}

export const addPoll = (question, answers) => ({
  type: ADD_POLL,
  question,
  answers,
});

export const addEditPoll = (questionInd, answers) => ({
  type: ADD_EDIT_POLL,
  questionInd,
  answers,
});

export const removePoll = index => ({
  type: DELETE_POLL,
  index,
});

export const updateVotes = (question, index, votes) => ({
  type: UPDATE_VOTES,
  question,
  index,
  votes,
});

// Async actions with thunk
export function fetchPolls() {
  return dispatch =>
		axios
			.get('/api/polls')
			.then((res) => {
  dispatch(receivePolls(res.data));
				// console.log(res);
})
			.catch((err) => {
  console.warn(err);
});
}

export function postPoll(question, answers) {
  return dispatch =>
		axios
			.post('/api/polls/new', addPoll(question, answers))
			.then(dispatch(addPoll(question, answers)))
			.catch((error) => {
  console.warn(err);
});
}

export function deletePoll(index, url) {
  console.warn(`/api/polls/${url}`);
  return dispatch =>
		axios.delete(`/api/polls/${url}`).then(dispatch(removePoll(index))).catch((error) => {
  console.warn(error);
});
}
