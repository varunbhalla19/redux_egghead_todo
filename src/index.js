import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';

let someId = 100

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

const setFilter = (state = "ALL", action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.filter;

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
  todos: todoListReducer, username: setUsername, filter: setFilter
});


// console.log(bigReducer);

const store = createStore(rootReducer);

console.log('init state => ', store.getState())

const Links = ({ active, clickHandler, children }) => (
  <button
    // onWheel={console.log(clickHandler)} 
    style={{ color: active ? 'indianRed' : 'black' }}
    onClick={clickHandler}
  >
    {children}
  </button >
)

class FilterLinks extends React.Component {
  render() {
    let state = store.getState();
    let { filter } = this.props;
    return (
      <Links
        // onClick={console.log(filter)}
        clickHandler={() => store.dispatch({ type: 'SET_FILTER', filter: filter })}
        currentFilter={state.filter}
        active={filter === state.filter}
      > {filter} </Links>
    );
  }
}

const FilterLinkList = () => (
  <div>
    {["ALL", "ACTIVE", "COMPLETED"].map(
      el => <FilterLinks key={--someId} filter={el}> </FilterLinks>
    )}
  </div>
);

const showFilteredTodos = (ar, fil) => {
  if (fil === 'ACTIVE') { return ar.filter(el => !el.completed) }
  if (fil === 'COMPLETED') { return ar.filter(el => el.completed) }
  return ar
}

const TodoItem = ({ clickHandle, completed, text, id }) => (
  <h5
    onClick={ev => clickHandle(id)}
    style={{ color: completed ? 'red' : 'whitesmoke' }}
  > {text} </h5>
)

class TheTodo extends React.Component {
  render() {
    let state = store.getState();
    return (
      <TodoList
        todoArray={showFilteredTodos(state.todos, state.filter)}
        clickHandle={id => store.dispatch({ type: 'TOGGLE', id: id })}
      />
    )
  }
}

const TodoList = ({ todoArray, clickHandle }) => (
  <div>
    {todoArray.map(tod => <TodoItem clickHandle={clickHandle} key={tod.id} {...tod} />)}
  </div>
)

const AddTodo = ({ clickHandler }) => {
  let input;
  return (
    <div>
      <input type="text" placeholder="Add Todos..."
        ref={node => (input = node)} />

      <button onClick={ev => {
        input.value && store.dispatch({ type: 'ADD', text: input.value, id: someId++ });
        input.value = null;
      }}
      >Add Todo</button>
    </div>
  )
}



const Todo = ({ username, filter, todos }) => (
  <div className="App" >

    <h2> Hello {username} </h2>

    <AddTodo />

    <FilterLinkList />

    <TheTodo />
    <p> Filter : {filter} </p>
  </div>
)

const renderr = () => {
  ReactDOM.render(
    <Todo />,
    document.getElementById('root')
  );
}

renderr();

store.subscribe(() => {
  console.log(store.getState());
  renderr();
})






































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










