import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';



const createStore = someReducer => {
  let state, listeners = [];

  let getState = () => state;

  let dispatch = action => {
    state = someReducer(state, action);
    listeners.forEach(listener => listener());
  }

  let subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(list => (list !== listener))
    }
  }

  dispatch({});

  return { getState, dispatch, subscribe };

}

const todoActionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        id: action.id, text: action.text, completed: false
      };
    case 'TOGGLE':
      if (state.id === action.id) {
        return { ...state, completed: !state.completed };
      }
      return state;
    default:
      return state;
  }
}

const todoListReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        todoActionReducer(undefined, action)
      ];
    case 'TOGGLE':
      return state.map(todo => todoActionReducer(todo, action))
    default:
      return state;
  }
}


const setUsername = (state = 'Varun', action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.username
    default:
      return state;
  }
}

let anotherCombineReducer = obj => {
  return (state = {}, action) => {
    return Object.keys(obj).reduce((nextState, key) => {
      nextState[key] = obj[key](state[key], action)
      return nextState;
    }, {})
  }
}

const rootReducer = anotherCombineReducer({
  todos: todoListReducer, username: setUsername
});


// console.log(bigReducer);

const store = createStore(rootReducer);


class Todo extends React.Component {
  someId = 100;
  render() {
    return (
      <div className="App" >

        <h2> Hello {this.props.value.username} </h2>
        <input type="text" placeholder="Add Todos..." ref={
          node => (this.input = node)
        } />

        <button onClick={ev => {
          let { value } = this.input
          console.log(value);
          value && store.dispatch({ type: 'ADD', text: value, id: this.someId++ });
          this.input.value = null;
        }}
        >Add Todo</button>

        <div>
          {this.props.value.todos.map(el => (
            <h3
              onClick={
                ev => store.dispatch({ type: 'TOGGLE', id: el.id })
              }
              style={{ color: el.completed ? 'red' : 'whitesmoke' }}
              key={el.id} > {el.text} </h3>
          ))}
        </div>

      </div>
    )
  }
}

const renderr = () => {
  ReactDOM.render(
    <Todo
      value={store.getState()}
    />,
    document.getElementById('root')
  );
}
renderr();

store.subscribe(renderr)






































// console.log('Initial State => ', store.getState());

// console.log('Dispatching ADD');
// store.dispatch({
//   type: 'ADD', id: 0, text: "Hey Bunny!"
// });

// console.log('Current State => ', store.getState());


// console.log('Dispatching TOGGLE');
// store.dispatch({
//   type: 'TOGGLE', id: 1
// });

// console.log('Current State => ', store.getState());

// console.log('Dispatching SET_USER');

// store.dispatch({
//   type: 'SET_USER', username: 'Bugs'
// });

// console.log('Current State => ', store.getState());










