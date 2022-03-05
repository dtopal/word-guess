import React from 'react';
import './App.css';
import Library from './library';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: [],          //just for tracking input
      word: '',           //the word to guess for the game
      displayWord: [],    //display, dashes and correct guesses
      wrongLetters: [],
      rightLetters: [],
      guess: [],          //all guessed letters
      remaining: 7,       //number of guesses
      keyClass: keyClass,
      lose: false,
      win: false
    };
    this.selectLetter = this.selectLetter.bind(this);
    this.setWord = this.setWord.bind(this);
    this.endGame = this.endGame.bind(this);
    //can I run a function in the construtor?
  }

  componentDidMount() {
    this.setWord();
    document.addEventListener('keydown', this.selectLetter);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.selectLetter);
  }
  componentDidUpdate() {
    //disable keyboard input if no guesses remaining
    if (this.state.remaining === 0 && this.state.lose !== true) {
      this.endGame();
      this.setState({
        lose: true
      });
    }
    if (this.state.word === this.state.displayWord.join('') && this.state.win !== true) {
      this.endGame();
      this.setState({
        win: true
      });
    }
  }

  endGame () {
    //disable keys
    var keys = {...this.state.keyClass};
    Object.keys(keys).forEach((item) => {
      keys[item] = keys[item] + ' Keys-Done';
    });
    this.setState(state => ({
      keyClass: keys
    }));
    //turn off keyboard event listner
    document.removeEventListener('keydown', this.selectLetter);
  }

  setWord () {
    //test
    // var test = Library.getWord();
    // console.log(test);

    //let testWords = ['dragon', 'age', 'mass', 'effect', 'chaos'];
    //var word = testWords[Math.floor(Math.random() * testWords.length)].toUpperCase();
    var word = Library.getWord();
    var display = [];
    for (let i = 0; i < word.length; i++) {
      display.push('_');
    }
    this.setState({
      word: word,
      displayWord: display
    });
  }


  selectLetter (event) {
    var letter = ''
    if (event.type === 'keydown' && event.code.slice(0, 3) === 'Key') {
      letter = event.code[3]
    }
    else if (event.type === 'click') {
      console.log(event.type);
      letter = event.target.value;
    }

    //var letter = event.target.value;
    var word = this.state.word;
    var display = [...this.state.displayWord];
    var guess= [...this.state.guess];

    var keyClass = {...this.state.keyClass}

    if (word.includes(letter) && !guess.includes(letter)) {
      //go through word to find index of letter and replace in display array,
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          display[i] = letter;
        }
      }
      //add letter to guess, add to rightLetters, and update displayWord
      keyClass[letter] = 'Key Choosen Correct';

      this.setState(state => ({
        input: [...state.input, letter],
        guess: [...state.guess, letter],
        rightLetters: [...state.rightLetters, letter],
        displayWord: display,
        keyClass: keyClass
      }))
    }
    else if (!word.includes(letter) && !guess.includes(letter)) {
      //if wrong, no update to display, letter added to guess, wrongLetters,
      //and remove one from remaining
      keyClass[letter] = 'Key Choosen';
      this.setState(state => ({
        input: [...state.input, letter],
        guess: [...state.guess, letter],
        wrongLetters: [...state.wrongLetters, letter],
        remaining: state.remaining - 1,
        keyClass: keyClass
      }))
    }
  }

  render() {

    return (
      <div id="AppContainer">
        <Display display={this.state.displayWord} remaining={this.state.remaining} />
        <Keyboard select={this.selectLetter} guess={this.state.guess} keyClass={this.state.keyClass} remaining={this.state.remaining} />
        <EndState lose={this.state.lose} win={this.state.win} word={this.state.word} />
      </div>
    );
  };;
}


class Keyboard extends React.Component {
  constructor(props){
    super(props);

  }

  render () {
    const top = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    const mid = ['A','S','D','F','G','H','J','K','L'];
    const bottom = ['Z','X','C','V','B','N','M'];


    let topKeys = top.map(x => <button className={this.props.keyClass[x]} value={x} key={x} onClick={this.props.select}>{x}</button>);
    let midKeys = mid.map(x => <button className={this.props.keyClass[x]} value={x} key={x} onClick={this.props.select}>{x}</button>);
    let bottomKeys = bottom.map(x => <button className={this.props.keyClass[x]} value={x} key={x} onClick={this.props.select}>{x}</button>);

    return(
      <div id="keyboard">
        <div id="keyboardContainer">
          <div className="KeyRow" id="topRow">{topKeys}</div>
          <div className="KeyRow" id="midRow">{midKeys}</div>
          <div className="KeyRow" id="bottomRow">{bottomKeys}</div>
        </div>
      </div>
    );
  }
}


class Display extends React.Component {
  constructor(props){
    super(props);
  }
  render() {

    let display = this.props.display.map((x,i) => <div className="Letter" key={"letter" + x + i}>{x}</div>);
    return(
      <div className="Display">
        <div id="Remaining-Container">
          <div id="Remaining">
            {this.props.remaining}
          </div>
        </div>
        <div id="Display-Container">
          <div>
            {display}
          </div>
          <div>
            <p>Type or click on letter to guess.</p>
          </div>
        </div>
      </div>
    )
  }
};

const EndState = (props) => {
  var classes = 'Hidden';
  if (props.lose || props.win) {
    classes = 'NotHidden'
  }

  var winDiv =
    <div id="Win-Message">
      <p>GAME OVER: YOU WIN!</p>
      <p>Word: {props.word}</p>
    </div>;

  var loseDiv =
    <div id="Lose-Message">
      <p>GAME OVER: YOU LOSE!</p>
      <p>Word: {props.word}</p>
    </div>;

  return(
      <div id="End-Container" className={classes}>
        <div id="End-Message">
          {props.win ? winDiv : loseDiv}
        </div>
      </div>
  )
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
var keyClass = {};
for (let i = 0; i < alphabet.length; i++) {
  keyClass[alphabet[i]] = "Key"
};

export default App;
