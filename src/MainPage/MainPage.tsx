import React, { useContext, useState } from "react";
import { Container, Button, Input, Header } from "semantic-ui-react";
import { DataContext, DataContextType, Player } from "../lib/DataContext";
import MainTable, { Column } from "../components/components/MainTable";
import { toArray } from "../helper";
import QuizPage from "./QuizPage";
import "./main-page.css";
import ControllerPage from "./ControllerPage";

const MainPage = () => {


  return (
    <div className="main-page">
      <QuizPage />
      <ControllerPage />
    </div>
  );
};

export default MainPage;
