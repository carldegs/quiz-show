import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext, Player, DataContextType } from "../../lib/DataContext";
import { Button, Header, Input, Dropdown, Grid } from "semantic-ui-react";
import MainTable, { Column } from "../../components/components/MainTable";
import { toArray } from "../../helper";

const ControllerPage = () => {
  const {
    data,
    addPlayer,
    removePlayer,
    addPoints,
    resetTimer,
    decrementTimer,
    setCurrentPlayer,
    setQuestion,
    setShowCurrAnswer,
  } = useContext(DataContext) as DataContextType;
  const [playerInput, setPlayerInput] = useState("");
  const {
    players,
    rounds,
    currRound,
    currTime,
    currPlayer,
    questions,
    currQuestion,
    showCurrAnswer,
  } = data;
  const round = rounds[currRound];
  const [defaultTime, setDefaultTime] = useState(round.time);
  const [scoreModifier, setScoreModifier] = useState(round.fixedPoints);
  let timer: any = useRef(null);
  let timeAfterStart: any = useRef(0);
  let [timerPaused, setTimerPaused] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");

  useEffect(() => {
    setDefaultTime(round.time);
  }, [round.time]);

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, []);

  const handleStartTimer = () => {
    setTimerPaused(false);
    timer.current = setInterval(() => {
      let isPaused = false;

      setTimerPaused((timerPaused) => {
        isPaused = timerPaused;
        return timerPaused;
      });

      if (isPaused) {
        return;
      }

      if (timeAfterStart.current + 1 === defaultTime) {
        clearInterval(timer.current);
        timer.current = null;
      }
      timeAfterStart.current = timeAfterStart.current + 1;
      decrementTimer();
    }, 1000);
  };
  

  const handleSetCurrPlayer = (playerName: string) => {
    setCurrentPlayer(playerName);
    if (!timerPaused) {
      setTimerPaused(true);
    }
  };

  const playerColumns = [
    {
      name: "#",
      value: "order",
      sortable: true,
    },
    {
      name: "Name",
      value: "name",
      sortable: true,
      render: (row: Player) => {
        if (currPlayer && row.name === currPlayer.name) {
          return <b>{row.name}</b>;
        } else {
          return row.name;
        }
      },
    },
    {
      name: "Points",
      value: "points",
      sortable: true,
    },
    {
      name: "Actions",
      actions: "actions",
      render: (row: Player) => (
        <>
          <Button
            icon="play"
            onClick={() => handleSetCurrPlayer(row.name)}
          />
          <Dropdown icon="ellipsis vertical">
            <Dropdown.Menu direction="left">
              <Dropdown.Item
                icon="add"
                text={`Add ${round.fixedPoints || 0} points`}
                onClick={() => addPoints(round.fixedPoints || 0, row.name)}
              />
              <Dropdown.Item
                icon="remove"
                text="Remove Player"
                onClick={() => removePlayer(row.name)}
              />
            </Dropdown.Menu>
          </Dropdown>
        </>
      ),
    },
  ] as Column[];

  const handleResetTimer = () => {
    timeAfterStart.current = 0;
    clearInterval(timer.current);
    resetTimer(defaultTime);
    timer.current = null;
  };

  return (
    <div
      style={{
        overflow: "auto",
        maxWidth: "500px",
        width: "600px",
        padding: "24px",
      }}
    >
      <Header>Round {currRound + 1}</Header>
      <Header>Timer</Header>
      <Input
        value={defaultTime}
        onChange={(e, { value }) => setDefaultTime(Number(value))}
      />
      <br />
      <Button onClick={handleResetTimer}>Reset</Button>
      {!!currTime && !timer.current && (
        <Button onClick={handleStartTimer}>Start</Button>
      )}
      {timer.current && (
        <Button
          onClick={() => {
            setTimerPaused(!timerPaused);
          }}
        >
          {!timerPaused ? "Pause" : "Resume"}
        </Button>
      )}

      {(currQuestion === null || showCurrAnswer) && (
        <>
          <Header>Questions</Header>
          <Dropdown
            placeholder="Select Question"
            search
            selection
            options={questions.map((q) => ({
              key: q.name,
              value: q.name,
              text: q.question,
            }))}
            onChange={(e, { value }) => {
              setSelectedQuestion(value as string);
            }}
            value={selectedQuestion}
          />

          <div style={{ display: "flex" }}>
            <Button
              onClick={() => {
                setQuestion(null);
              }}
              icon="remove"
              content="Hide Q"
              disabled={!selectedQuestion}
            />

            <Button
              onClick={() => {
                setQuestion(null);
                setTimeout(() => {
                  setQuestion(selectedQuestion);
                  handleResetTimer();
                  handleStartTimer();
                }, 200);
              }}
              icon="check"
              content="Set Selected Q"
              disabled={
                !!(
                  !selectedQuestion ||
                  (currQuestion &&
                    questions[currQuestion] &&
                    questions[currQuestion].name === selectedQuestion)
                )
              }
            />
          </div>
        </>
      )}
      {currQuestion !== null && !showCurrAnswer && (
        <>
          <Header as="p" style={{ fontSize: "14px"}}>
            Question: {currQuestion !== null && questions[currQuestion]?.question}
          </Header>
          <Header as="p" style={{ fontSize: "14px" }}>
            Answer: {currQuestion !== null && questions[currQuestion]?.answer}
          </Header>
        </>
      )}
      
      {currQuestion !== null && !currPlayer && !showCurrAnswer && (
        <>
          <Header as="p" color="red">
            Select Player
          </Header>
          <Grid stackable columns={4} container>
            { (toArray(players) as Player[]).map(p => (
              <Button
                icon="play"
                content={p.name}
                onClick={() => handleSetCurrPlayer(p.name)}
              />
            ))}
          </Grid>
          <Header as="p">
            Skip
          </Header>
          <Button
            onClick={() => {
              setCurrentPlayer(null);
              setShowCurrAnswer(true);

              const selectedIdx = questions
                .map((q) => q.name)
                .indexOf(selectedQuestion);

              if (selectedIdx >= 0 && selectedIdx + 1 !== questions.length) {
                setSelectedQuestion(questions[selectedIdx + 1].name);
              }
            }}
            icon="next"
            content="Show A"
          />
        </>
      )}
      
      {currQuestion !== null && currPlayer && !showCurrAnswer && (
        <>
          <Header as="p" style={{ fontSize: "14px" }}>
            Player: {currPlayer && currPlayer.name}
          </Header>
          <Input
            value={scoreModifier}
            onChange={(e, { value }) => setScoreModifier(Number(value))}
            placeholder="Score Modifier"
          />
          <div>
            <Button
              onClick={() => {
                addPoints(scoreModifier ? -scoreModifier : 0, currPlayer?.name);
                setCurrentPlayer(null);
                if (timerPaused) {
                  setTimerPaused(false);
                }
              }}
              icon="remove"
              content="Wrong!"
            />
            <Button
              onClick={() => {
                if (currPlayer?.name) {
                  addPoints(scoreModifier || 0, currPlayer?.name);
                }
                setCurrentPlayer(null);
                setShowCurrAnswer(true);
                const selectedIdx = questions
                  .map((q) => q.name)
                  .indexOf(selectedQuestion);

                if (selectedIdx >= 0 && selectedIdx + 1 !== questions.length) {
                  setSelectedQuestion(questions[selectedIdx + 1].name);
                }
              }}
              icon="check"
              content="Correct!"
            />
          </div>
        </>
      )}

      <Header>Players</Header>
      <div>
        <Input
          onChange={(e, { value }) => setPlayerInput(value)}
          value={playerInput}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              setPlayerInput("");
              addPlayer(playerInput);
            }
          }}
          placeholder="Add Player"
        />
      </div>
      <MainTable
        columnList={playerColumns}
        data={toArray(players)}
        unstackable
      />
    </div>
  );
};

export default ControllerPage;
