import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";

import { Provider } from "react-redux";

import { connect } from "react-redux";

let someId = 100;

const createStore = (someReducer) => {
  let state,
    listeners = [];

  let getState = () => state;

  let dispatch = (action) => {
    state = someReducer(state, action);
    listeners.forEach((listener) => listener());
  };

  let subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((list) => list !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};

const todoActionReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case "TOGGLE":
      if (state.id === action.id) {
        return { ...state, completed: !state.completed };
      }
      return state;
    default:
      return state;
  }
};

const todoListReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD":
      return [...state, todoActionReducer(undefined, action)];
    case "TOGGLE":
      return state.map((todo) => todoActionReducer(todo, action));
    default:
      return state;
  }
};

const setUsername = (state = "Varun", action) => {
  switch (action.type) {
    case "SET_USER":
      return action.username;
    default:
      return state;
  }
};

const setFilter = (state = "ALL", action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.filter;

    default:
      return state;
  }
};

let anotherCombineReducer = (obj) => {
  return (state = {}, action) => {
    return Object.keys(obj).reduce((nextState, key) => {
      nextState[key] = obj[key](state[key], action);
      return nextState;
    }, {});
  };
};

const rootReducer = anotherCombineReducer({
  todos: todoListReducer,
  username: setUsername,
  filter: setFilter,
});

const showFilteredTodos = (ar, fil) => {
  if (fil === "ACTIVE") {
    return ar.filter((el) => !el.completed);
  }
  if (fil === "COMPLETED") {
    return ar.filter((el) => el.completed);
  }
  return ar;
};

const setUsernameAction = (name) => ({ type: "SET_USER", username: name });

const toggleUserAction = (id) => ({
  type: "TOGGLE",
  id: id,
});

const setFilterAction = (filter) => ({
  type: "SET_FILTER",
  filter: filter,
});

const AddTodoAction = (name) => ({
  type: "ADD",
  text: name,
  id: someId++,
});

const store = createStore(rootReducer);

const Links = ({ active, filter, clickHandler }) => (
  <button
    style={{ color: active ? "indianRed" : "black" }}
    onClick={() => clickHandler(filter)}
  >
    {filter}
  </button>
);

const mapStateToPropsLinks = (state, { filter }) => ({
  currentFilter: state.filter,
  active: filter === state.filter,
  filter: filter,
});

// const mapDispatchToPropsLinks = (dispatch, { filter }) => ({
//   clickHandler: () => dispatch(setFilterAction(filter)),
// });

const FilterLinks = connect(mapStateToPropsLinks, {
  clickHandler: setFilterAction,
})(Links);

const FilterLinkList = () => (
  <div>
    {["ALL", "ACTIVE", "COMPLETED"].map((el) => (
      <FilterLinks key={--someId} filter={el}>
        {" "}
      </FilterLinks>
    ))}
  </div>
);

const TodoItem = ({ clickHandle, completed, text, id }) => (
  <h5
    onClick={() => clickHandle(id)}
    style={{ color: completed ? "red" : "whitesmoke" }}
  >
    {" "}
    {text}{" "}
  </h5>
);

const TodoList = ({ todoArray, clickHandle }) => (
  <div>
    {todoArray.map((tod) => (
      <TodoItem clickHandle={clickHandle} key={tod.id} {...tod} />
    ))}
  </div>
);

const mapStateToPropsTodo = (state) => ({
  todoArray: showFilteredTodos(state.todos, state.filter),
});

const TheTodo = connect(mapStateToPropsTodo, { clickHandle: toggleUserAction })(
  TodoList
);

const fetchAndReply = () => {
  fetch("hi")
    .then((res) => res.text())
    .then((data) => {
      console.log("Data recieved ", data);
    });
};

let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input
        type="text"
        placeholder="Add Todos..."
        ref={(node) => (input = node)}
      />

      <button
        onClick={(ev) => {
          input.value && dispatch(AddTodoAction(input.value));
          input.value = null;
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect(null, null)(AddTodo);

let Header = ({ username }) => <h2> Helloooo {username} </h2>;
Header = connect((state) => ({ username: state.username }))(Header);

const Todo = ({ filter, dispatch }) => (
  <div className="App">
    <Header />

    <AddTodo store={store} />

    <FilterLinkList />

    <TheTodo />

    <p> Filter : {filter} </p>
    {/* <button onClick={(ev) => dispatch(setUsernameAction("Nurav"))}> */}
    <button onClick={fetchAndReply}>Change User</button>
  </div>
);

const RealTodo = connect((state) => ({ filter: state.filter }), null)(Todo);

ReactDOM.render(
  <Provider store={store}>
    <RealTodo />
  </Provider>,
  document.getElementById("root")
);

console.log(store.getState());
