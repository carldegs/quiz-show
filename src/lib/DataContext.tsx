import React, { useReducer, useEffect } from "react";
import reducer from "./reducer";
import { parseState } from "../helper";

const DataContext = React.createContext({});
const localStorageKey = "quiz-show";

export class Player {
  constructor(
    public name: string,
    public order?: number,
    public points = 0,
    public bid = 0
  ) {}

  static parse(object: any): Player {
    const { name, order, points, bid } = object;
    return new Player(name, order, points, bid);
  }
}

export class Question {
  constructor(
    public name: string,
    public question: string,
    public answer: string,
    public choices = [],
    public difficulty = 0
  ) {}

  static parse(object: any): Question {
    const { name, question, answer, choices, difficulty } = object;
    return new Question(name, question, answer, choices, difficulty);
  }
}

enum PointsType {
  Fixed,
  Bid,
  Difficulty,
  Time,
}

export class Round {
  constructor(
    public pointsType: PointsType,
    public time: number,
    public fixedPoints?: number,
    public difficultyPoints?: number[]
  ) {}

  static parse(object: any): Round {
    const { pointsType, time, fixedPoints, difficultyPoints } = object;
    return new Round(pointsType, time, fixedPoints, difficultyPoints);
  }
}

export interface State {
  players: Record<string, Player>;
  currPlayer: Player | null;
  currQuestion: Question | null;
  currRound: number;
  rounds: Round[];
  currTime: number;
}

const initialState: State = {
  players: {},
  currPlayer: null,
  currQuestion: null,
  currRound: 0,
  rounds: [
    new Round(PointsType.Fixed, 10, 50),
    new Round(PointsType.Fixed, 10, 100),
    new Round(PointsType.Bid, 30),
  ],
  currTime: 0,
};

const fetchState = () => {
  const dataStr = localStorage.getItem(localStorageKey);

  console.log(dataStr);
  if (dataStr) {
    try {
      const savedState = JSON.parse(dataStr);
      const { players, currPlayer, currQuestion, rounds } = savedState;
      return {
        ...savedState,
        players: parseState(players, Player),
        currPlayer: Player.parse(currPlayer),
        currQuestion: currQuestion ? Question.parse(currQuestion) : null,
        rounds: rounds.map((round: any) => Round.parse(round)),
      };
    } catch(e) {
      console.error('err', e)
      return initialState;
    }
  }
};

export enum ActionTypes {
  AddPlayer,
  RemovePlayer,
  SetPoints,
  AddPoints,
  SetBid,
  ResetBid,
  AddBidToPoints,
  SubtractBidToPoints,
  NextQuestion,
  StartTime,
  UpdateTime,
  ResetTime,
  NextRound,
  SetCorrectAnswer,
  SetWrongAnswer,
  DecrementTimer,
  SetCurrentPlayer,
}

export interface ActionCreatorsType {
  addPlayer(name: string, initialPoints?: number): null;
  removePlayer(name: string): null;
  setPoints(points: number, player?: string): null;
  addPoints(toAdd: number, player?: string): null;
  setBid(bid: number, player?: string): null;
  resetBid(player?: string): null;
  addBidToPoints(player?: string): null;
  subtractBidToPoints(player?: string): null;
  nextQuestion(): null;
  startTimer(): null;
  resetTimer(time: number): null;
  getTime(): number;
  pauseTimer(): null;
  nextRound(): null;
  setCorrectAnswer(): null;
  setWrongAnswer(): null;
  decrementTimer(): null;
  setCurrentPlayer(playerName: string): null;
}

export interface DataContextType extends ActionCreatorsType {
  data: State;
}

const setActionCreators = (data: State, dispatch: any) => {
  const callDispatch = (type: ActionTypes, payload?: any) =>
    dispatch({ type, payload });

  return {
    addPlayer: (name, initialPoints = 0) =>
      callDispatch(ActionTypes.AddPlayer, { name, initialPoints }),
    removePlayer: (name) => callDispatch(ActionTypes.RemovePlayer, name),
    setPoints: (points, player) =>
      callDispatch(ActionTypes.SetPoints, { points, player }),
    addPoints: (points, player) =>
      callDispatch(ActionTypes.AddPoints, { points, player }),
    setBid: (bid, player) => callDispatch(ActionTypes.SetBid, { bid, player }),
    resetBid: (player) => callDispatch(ActionTypes.ResetBid, player),
    addBidToPoints: (player) =>
      callDispatch(ActionTypes.AddBidToPoints, player),
    subtractBidToPoints: (player) =>
      callDispatch(ActionTypes.SubtractBidToPoints, player),
    nextQuestion: () => callDispatch(ActionTypes.NextQuestion),
    resetTimer: (time) => callDispatch(ActionTypes.ResetTime, time),
    decrementTimer: () => callDispatch(ActionTypes.DecrementTimer),
    setCurrentPlayer: (playerName) =>
      callDispatch(ActionTypes.SetCurrentPlayer, playerName),
  } as ActionCreatorsType;
};

function DataProvider(props: any) {
  const [data, dispatch] = useReducer(reducer, fetchState());

  useEffect(() => {
    const fetchData = async () => {
      // const modules = await fetchModules();

      // console.log('modules', modules);

      // dispatch({
      //   type: ActionTypes.FetchModules,
      //   payload: {
      //     modules,
      //     updateDate: new Date(),
      //   }
      // });
    }

    // if (!toArray(data.modules).length) {
    //   fetchData();
    // }

  }, []);

  const actionCreators: ActionCreatorsType = setActionCreators(data, dispatch);
  localStorage.setItem(localStorageKey, JSON.stringify(data));

  return (
    <DataContext.Provider value={{ data, dispatch, ...actionCreators }}>
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
