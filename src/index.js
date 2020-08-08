import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';

// import { Provider } from 'react-redux';

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


// const store = createStore(rootReducer);
// console.log('init state => ', store.getState())

const showFilteredTodos = (ar, fil) => {
  if (fil === 'ACTIVE') { return ar.filter(el => !el.completed) }
  if (fil === 'COMPLETED') { return ar.filter(el => el.completed) }
  return ar
}

const store = createStore(rootReducer);

const StoreContext = React.createContext(store);


const Links = ({ active, clickHandler, children }) => (
  <button
    style={{ color: active ? 'indianRed' : 'black' }}
    onClick={clickHandler}
  >
    {children}
  </button >
)

const FilterLinks = ({ filter }) => (
  <StoreContext.Consumer>
    {store => (
      <Links
        clickHandler={() => store.dispatch({ type: 'SET_FILTER', filter: filter })}
        currentFilter={store.getState().filter}
        active={filter === store.getState().filter}
      >
        {filter}
      </Links>
    )
    }
  </StoreContext.Consumer>
)

const FilterLinkList = () => (
  <div>
    {["ALL", "ACTIVE", "COMPLETED"].map(
      el => <FilterLinks key={--someId} filter={el}> </FilterLinks>
    )}
  </div>
);

const TodoItem = ({ clickHandle, completed, text, id }) => (
  <h5
    onClick={ev => clickHandle(id)}
    style={{ color: completed ? 'red' : 'whitesmoke' }}
  > {text} </h5>
)


const TodoList = ({ todoArray, clickHandle }) => (
  <div>
    {todoArray.map(tod => <TodoItem clickHandle={clickHandle} key={tod.id} {...tod} />)}
  </div>
)

const TheTodo = () => (
  <StoreContext.Consumer>
    {store => (
      <TodoList
        todoArray={showFilteredTodos(store.getState().todos, store.getState().filter)}
        clickHandle={id => store.dispatch({ type: 'TOGGLE', id: id })}
      />
    )}
  </StoreContext.Consumer>
)


const AddTodo = ({ store }) => {
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

const Header = ({ store }) => (
  <StoreContext.Consumer>
    {
      store => (
        <h2> Helloooo {store.getState().username} </h2>
      )
    }
  </StoreContext.Consumer>
)

const Todo = ({ store }) => (
  <div className="App" >

    <StoreContext.Provider value={store} >
      <Header />
    </StoreContext.Provider>

    <AddTodo store={store} />

    <FilterLinkList />

    <TheTodo />

    <p> Filter : {store.getState().filter} </p>

    <button
      onClick={ev => store.dispatch({ type: 'SET_USER', username: 'Rabbit' })}
    >
      Change User </button>

  </div>
)


const renderr = () => {
  ReactDOM.render(
    <Todo store={createStore(rootReducer)} />
    ,
    document.getElementById('root')
  );
}

renderr();

store.subscribe(() => {
  console.log(store.getState());
  renderr();
})

