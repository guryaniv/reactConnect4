import React from "react";
import "./styles.css";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function App() {
  return (
    <div className="App">
      <img src="https://raw.githubusercontent.com/guryaniv/reactConnect4/master/src/connect4logo.png"
        alt="connect4 logo"
        width="50%"
      />
      <Game />
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    /* 
    State Props: 
    turn: Which player's turn it is (true for yellow, false for red)
    cells: color for each cell (0 for empty, 1 for yellow, 2 for red)
    winner: Which player has won ( 0 for no one, 1 for yellow, 2 for red) 
    */
    let cells = [];
    for (let i = 0; i < 6; i++) {
      cells.push(new Array(7).fill(0)); // array for each Row, all inside cells array
    }
    this.state = { turn: false, cells: cells, winner: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  checkDiagonal(row, col) {
    //find right and left tops
    let c = this.state.cells;
    let val = this.state.turn ? 2 : 1;
    let rR = row;
    let cR = col;
    while (rR < 5 && cR < 6) {
      rR++;
      cR++;
    }
    while (rR >= 3 && cR >= 3) {
      if (
        c[rR][cR] === val &&
        c[rR - 1][cR - 1] === val &&
        c[rR - 2][cR - 2] === val &&
        c[rR - 3][cR - 3] === val
      ) {
        return 1;
      }
      rR--;
      cR--;
    }
    let rL = row;
    let cL = col;
    while (rL < 5 && cL > 0) {
      rL++;
      cL--;
    }
    while (rL >= 3 && cL <= 3) {
      if (
        c[rL][cL] === val &&
        c[rL - 1][cL + 1] === val &&
        c[rL - 2][cL + 2] === val &&
        c[rL - 3][cL + 3] === val
      ) {
        return 1;
      }
      rL--;
      cL++;
    }
    return 0;
  }

  checkHorizontal(row, col) {
    let c = this.state.cells;
    let i = 6;
    let val = this.state.turn ? 2 : 1;

    while (i >= 3) {
      if (
        c[row][i] === val &&
        c[row][i - 1] === val &&
        c[row][i - 2] === val &&
        c[row][i - 3] === val
      ) {
        return 1;
      }
      i--;
    }
    return 0;
  }

  checkVertical(row, col) {
    let c = this.state.cells;
    let i = row;
    let val = this.state.turn ? 2 : 1;

    if (i >= 3) {
      if (
        c[i][col] === val &&
        c[i - 1][col] === val &&
        c[i - 2][col] === val &&
        c[i - 3][col] === val
      ) {
        return 1;
      }
    }
    return 0;
  }

  checkVictory(row, col) {
    // Return true if somebody won
    return (
      this.checkVertical(row, col) ||
      this.checkHorizontal(row, col) ||
      this.checkDiagonal(row, col)
    );
  }

  findAvailableRow(col) {
    for (let i = 0; i < 6; i++) {
      console.log(i, col);
      if (this.state.cells[i][col] === 0) {
        return i;
      }
    }
    return -1;
  }

  handleClick(row, col) {
    if (this.state.winner) {
      //Game Over - click shouldn't change anything
      return;
    }
    console.log("clicked! row: " + row + " | col: " + col);
    let temp = [];
    for (let i = 0; i < 6; i++) {
      temp.push(this.state.cells[i].slice());
    }
    let newRow = this.findAvailableRow(col);
    if (newRow === -1) {
      console.log("Failed attempt to push to full column");
      return;
    }
    temp[newRow][col] = this.state.turn ? 1 : 2;
    this.setState({ cells: temp, turn: !this.state.turn }, () => {
      if (this.checkVictory(newRow, col) > 0) {
        console.log("win!");
        this.setState({ winner: this.state.turn ? 2 : 1 });
        // CONFETTI !
      }
    });
  }

  restart() {
    let cells = [];
    for (let i = 0; i < 6; i++) {
      cells.push(new Array(7).fill(0));
    }
    this.setState({ turn: false, cells: cells, winner: 0 });
  }

  render() {
    return (
      <div>
        <h2>
          {this.state.winner > 0
            ? this.state.winner === 1
              ? "Yellow Wins!"
              : "Red Wins!"
            : this.state.turn
            ? "Yellow's Turn"
            : "Red's Turn"}{" "}
        </h2>
        <ShellConfetti win={this.state.winner} />
        <Board cells={this.state.cells} handleClick={this.handleClick} />
        <button onClick={() => this.restart()}>New Game</button>
      </div>
    );
  }
}

function Board(props) {
  let style = {
    width: "fit-content",
    margin: "auto",
    padding: "10px"
  };
  let rows = [];
  for (let i = 5; i >= 0; i--) {
    rows.push(
      <Row
        key={i}
        row={i}
        cells={props.cells[i]}
        handleClick={props.handleClick}
      />
    );
  }
  return <div style={style}>{rows}</div>;
}

function Row(props) {
  let style = {
    display: "flex"
  };
  let cells = [];
  for (let i = 0; i < 7; i++) {
    cells.push(
      <GridCell
        key={i}
        cell={props.cells[i]}
        row={props.row}
        col={i}
        handleClick={props.handleClick}
      />
    );
  }
  return <div style={style}>{cells}</div>;
}

function GridCell(props) {
  let style = {
    height: 70,
    width: 70,
    border: "2px solid black",
    backgroundColor: "blue"
  };
  return (
    <div style={style} onClick={() => props.handleClick(props.row, props.col)}>
      <Circle cell={props.cell} />
    </div>
  );
}

function Circle(props) {
  let color = "white";
  if (props.cell === 1) {
    color = "yellow";
  } else if (props.cell === 2) {
    color = "red";
  }
  let style = {
    backgroundColor: color,
    border: "2px solid black",
    borderRadius: "98%",
    paddingTop: "92%"
  };
  return <div style={style} />;
}

function ShellConfetti(props) {
  const { width, height } = useWindowSize();
  if (props.win === 1 || props.win === 2) {
    return <Confetti width={width} height={height} />;
  } else {
    return null;
  }
}
