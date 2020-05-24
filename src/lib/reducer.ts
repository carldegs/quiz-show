import { ActionTypes, State, Player } from "./DataContext";
import { toObject, toArray } from "../helper";


const reducer = (state: State, action: any) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.AddPlayer:
      const { name, initialPoints } = payload;
      const newPlayer = new Player(
        name,
        Object.keys(state.players).length,
        initialPoints
      );
      return {
        ...state,
        players: {
          ...state.players,
          [name]: newPlayer,
        },
        currPlayer: state.currPlayer ? state.currPlayer : newPlayer,
      } as State;
    case ActionTypes.RemovePlayer:
      const toRemoveIndex = Number(state.players[payload].order);
      let newPlayersArr = toArray(state.players);
      newPlayersArr.splice(toRemoveIndex, 1);
      newPlayersArr = newPlayersArr
        .sort((a, b) => a.order - b.order)
        .map((a, i) => ({ ...a, order: i }));

      const newPlayers = toObject(newPlayersArr) as Record<string, Player>;
      const deleteCurrPlayer = state.currPlayer?.name === payload;
      return {
        ...state,
        players: newPlayers,
        currPlayer: deleteCurrPlayer ? null : state.currPlayer,
      };
    case ActionTypes.AddPoints:
      const { points, player } = payload;
      if (player) {
        return {
          ...state,
          players: {
            ...state.players,
            [player]: {
              ...state.players[player],
              points: state.players[player].points + points,
            },
          },
        };
      } else {
        return {
          ...state,
          players: toObject(
            toArray(state.players).map((p) => ({
              ...p,
              points: p.points + points,
            }))
          ),
        };
      }
    case ActionTypes.ResetTime:
      return {
        ...state,
        currTime: payload,
      }
    case ActionTypes.DecrementTimer:
      return {
        ...state,
        currTime: state.currTime - 1,
      }
    case ActionTypes.SetCurrentPlayer:
      return {
        ...state,
        currPlayer: state.players[payload]
      }
    case ActionTypes.SetQuestion:
      const questionIds = state.questions.map(q => q.name);

      if (payload === "next") {
        // get next question
        const nextQuestionId = state.currQuestion ? state.currQuestion + 1 : 0;
        return {
          ...state,
          currQuestion: nextQuestionId,
          showCurrAnswer: false,
        }
      } else if (!payload) {
        return {
          ...state,
          currQuestion: null,
        }
      }

      const currentIdx = questionIds.indexOf(payload);

      return {
        ...state,
        currQuestion: currentIdx ? currentIdx : 0,
        showCurrAnswer: false,
      }
    case ActionTypes.SetShowCurrAnswer:
      return {
        ...state,
        showCurrAnswer: payload,
      }
    default:
      return state;
  }
};

export default reducer;
