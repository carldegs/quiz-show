import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from "react";
import "./quiz-page.css";
import { getRandInt, toArray } from "../../helper";
import { Button, Header } from "semantic-ui-react";
import { DataContext, DataContextType, Player } from "../../lib/DataContext";
import FlipMove from "react-flip-move";

const QuizPage = () => {
  const [blobNum, setBlobNum] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const { data } = useContext(DataContext) as DataContextType;
  const { currTime, players, currPlayer } = data;
  let timer: any = useRef(null);

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

    console.log(a, b);
    setPosition(() => [a, b]);
  }, [currTime]);

  return (
    <div className="quiz-page">
      <svg
        viewBox="0 0 200 200"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <path
          className={`blob-${blobNum}`}
          fill="#438dce"
          transform="translate(100 100)"
        ></path>
        <text
          fill="#fcf753"
          textAnchor="middle"
          transform={`translate(${
            110 + (position[0] / (currTime < 10 ? 2 : 1))
          } ${120 + (position[1] / (currTime < 10 ? 2 : 1))}) ${
            currTime < 10 ? "scale(2)" : ""
          }`}
          fontSize="60px"
        >
          {currTime}
        </text>
      </svg>
      <br />
      <br />
      <br />
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
  );
};

export default QuizPage;
