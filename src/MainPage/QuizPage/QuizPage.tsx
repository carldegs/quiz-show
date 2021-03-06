import React, {
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";
import "./quiz-page.css";
import { getRandInt, toArray } from "../../helper";
import { Header } from "semantic-ui-react";
import { DataContext, DataContextType, Player } from "../../lib/DataContext";
import FlipMove from "react-flip-move";

const QuizPage = () => {
  const [blobNum, setBlobNum] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const { data } = useContext(DataContext) as DataContextType;
  const { currTime, players, currPlayer, questions, currQuestion, showCurrAnswer } = data;

  useEffect(() => {
    setBlobNum((blobNum) => {
      let num = getRandInt(1, 8);
      while (num === blobNum) {
        num = getRandInt(1, 8);
      }
      return num;
    });

    const a = getRandInt(-30, 30);
    const b = getRandInt(-30, 30);

    setPosition(() => [a, b]);
  }, [currTime]);

  const getTextColor = () => {
    return ([
      '#fa2583',
      '#a231ef',
    ])[getRandInt(0,2)]
  }

  const hasAQuestion =
    questions && currQuestion !== null && questions[currQuestion as number];

  return (
    <div className="quiz-page">
      <div>
        <svg
          viewBox="0 0 200 200"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className={`timer ${showCurrAnswer ? 'hidden' : ''}`}
         
        >
          <path
            className={`blob-${blobNum}`}
            fill="#000a77"
            transform={`translate(100 100) rotate(${getRandInt(-15, 16)} ${getRandInt(-15, 16)} 0)`}
            style={{ transformBox: "fill-box", transformOrigin: "center"}}
          ></path>
          <text
            fill={getTextColor()}
            textAnchor="middle"
            transform={`translate(${
              110 + position[0] / (currTime < 10 ? 2 : 1)
            } ${120 + position[1] / (currTime < 10 ? 2 : 1)}) ${
              currTime < 10 ? "scale(2)" : `scale(${getRandInt(90, 150)/100})`
            }`}
            fontSize="60px"
          >
            {currTime}
          </text>
        </svg>
        <div className="players">
          <FlipMove>
            {toArray(players)
              .sort((a, b) => b.points - a.points)
              .map((player: Player) => (
                <div
                  className={`player ${
                    currPlayer?.name === player.name ? "current" : ""
                  }`}
                  key={player.name}
                >
                  <Header className="player-name">{player.name}</Header>
                  <Header className="player-score">{player.points}</Header>
                </div>
              ))}
          </FlipMove>
        </div>
      </div>
      <div className="question-wrapper">
        <FlipMove>
          <div
            className={`question ${hasAQuestion ? '' : 'hidden'} ${showCurrAnswer ? 'minimize' : ''}`}
            dangerouslySetInnerHTML={{
              __html: hasAQuestion ? questions[currQuestion as number].question as string : "",
            }}
          />
          <div
            className={`answer ${hasAQuestion && showCurrAnswer ? '' : 'hidden'}`}
            dangerouslySetInnerHTML={{
              __html: hasAQuestion ? questions[currQuestion as number].answer as string : "",
            }}
          />
        </FlipMove>
      </div>
    </div>
  );
};

export default QuizPage;
