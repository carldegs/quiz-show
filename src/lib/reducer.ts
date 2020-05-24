import { ActionTypes, State, Player } from "./DataContext";
import { deleteProperty, toObject, toArray } from "../helper";

const timer = null;

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

      return {
        ...state,
        players: newPlayers,
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
    default:
      return state;
  }
};

export default reducer;
