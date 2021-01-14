import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={"square" + (props.highlight ? " highlight" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                highlight={this.props.line.includes(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard() {
        let board = [];
        for(let i = 0; i < 3; i++){
            let row = [];
            for(let j = 0; j < 3; j++){
                row.push(this.renderSquare(i * 3 + j));
            }
            board.push(<div key={i} className="board-row">{row}</div>);
        }
        return board;
    }

    render() {
        return (
            <div>{this.renderBoard()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: Array(2).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            listIsDesc: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const [winner, ] = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: [i % 3, Math.floor(i / 3)]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleChange(){
        this.setState({
            listIsDesc: !this.state.listIsDesc,
        })
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, line] = calculateWinner(current.squares);

        if(this.state.listIsDesc){
            history = history.map(item => item).reverse();
        }

        const moves = history.map((step, move, array) => {
            if(this.state.listIsDesc){
                move = array.length - move - 1;
            }
            let desc = move ?
                `Go to move (${step.location})` :
                'Go to game start';
            if(move === this.state.stepNumber){
                desc = <b>{desc}</b>
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        line={line}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <input type="checkbox" onChange={() => this.handleChange()} />Descending
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, []];
}
