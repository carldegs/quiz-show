import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext, Player, DataContextType } from "../../lib/DataContext";
import { Button, Header, Input, Dropdown } from "semantic-ui-react";
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
  } = useContext(DataContext) as DataContextType;
  const [playerInput, setPlayerInput] = useState("");
  const { players, rounds, currRound, currTime, currPlayer } = data;
  const round = rounds[currRound];
  const [defaultTime, setDefaultTime] = useState(round.time);
  let timer: any = useRef(null);
  let timeAfterStart: any = useRef(0);

  useEffect(() => {
    setDefaultTime(round.time);
  }, [round.time]);

  const handleStartTimer = () => {
    timer.current = setInterval(() => {
      console.log("timeAfterStart", timeAfterStart.current);
      if (timeAfterStart.current + 1 === defaultTime) {
        clearInterval(timer.current);
      }
      timeAfterStart.current = timeAfterStart.current + 1;
      decrementTimer();
    }, 1000);
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
        <Dropdown icon="ellipsis vertical">
          <Dropdown.Menu direction="left">
            <Dropdown.Item
              icon="play"
              text="Set current player"
              onClick={() => setCurrentPlayer(row.name)}
            />
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
      ),
    },
  ] as Column[];

  return (
    <div
      style={{
        overflow: "auto",
        maxWidth: "500px",
        width: "500px",
        padding: "24px",
      }}
    >
      <Header>Round {currRound + 1}</Header>
      <Header>Timer</Header>
      <Input
        value={defaultTime}
        onChange={(e, { value }) => setDefaultTime(Number(value))}
      />
      <Button
        onClick={() => {
          timeAfterStart.current = 0;
          clearInterval(timer.current);
          resetTimer(defaultTime);
        }}
      >
        Reset Timer
      </Button>
      <Button onClick={handleStartTimer} disabled={currTime === 0}>
        Start Timer
      </Button>
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
