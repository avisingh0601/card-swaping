import React, { Component } from "react";
import ReactDOM from "react-dom";
import Card from "./components/card";
import CardDeck from "./container/cardDeck";
import RefreshIcon from "@material-ui/icons/Refresh";
import "normalize.css";
import "./styles.css";

class App extends Component {
  cards = [
    { id: 0, title: "Food Scientist" },
    {
      id: 1,
      title: "Carpanter"
    }
  ];
  state = {
    id: 0
  };
  reset = () => {
    this.setState((state) => ({
      id: state.id + 1
    }));
  };
  render() {
    return (
      <div className="App">
        <CardDeck cardDeckId={this.state.id}>
          <Card title="Food Scientis"></Card>
          <Card title="Carpanter"></Card>
          <Card title="Musican" fixed></Card>
        </CardDeck>
        <div className="Button">
          <button onClick={this.reset}>
            <RefreshIcon />
          </button>
        </div>
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
