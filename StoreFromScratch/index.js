import Helper from "./helper";
import * as Redux from "redux";

const createStore = reducer => {
  let state;

  let listeners = [];

  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(
        currentListener => currentListener == listener
      );
    };
  };

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  //return clojure
  return {
    getState,
    subscribe,
    dispatch
  };
};

//mit state = [], setzen wir state zu einem leeren array, falls state momentan noch undefined ist
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.todo]);
      break;

    case "REMOVE_TODO":
      return state.filter(todo => todo.id != action.id);
      break;

    case "TOGGLE_TODO":
      return state.map(todo => {
        if (todo.id == action.id) {
          todo.completed = !todo.completed;
          console.log("reducer trigerred");
          return todo;
        }
        return todo;
      });

    default:
      return state;
  }
};

const goals = (state = [], action) => {
  switch (action.type) {
    case "ADD_GOAL":
      return [...state, action.goal];

    case "REMOVE_GOAL":
      return state.filter(goal => goal.id != action.id);
    case "TOGGLE_GOAL":
      return state.map(goal => {
        if (goal.id == action.id) {
          return { ...goal, completed: !goal.completed };
        }
        return goal;
      });

    default:
      return state;
  }
};

const rootReducer = (state = {}, action) => {
  return {
    goals: goals(state.goals, action),
    todos: todos(state.todos, action)
  };
};

const store = Redux.createStore(
  Redux.combineReducers({
    goals,
    todos
  })
);

store.subscribe(() => console.log("State got updated"));
const unsubscribe = store.subscribe(() =>
  console.log(`New State is:`, store.getState())
);

//action creator

const addTodoAction = todo => ({
  type: "ADD_TODO",
  todo
});

const removeTodoAction = id => ({
  type: "REMOVE_TODO",
  id
});

const toggleTodoAction = id => ({
  type: "TOGGLE_TODO",
  id
});

const addGoalAction = goal => ({
  type: "ADD_GOAL",
  goal
});

const removeGoalAction = id => ({
  type: "REMOVE_GOAL",
  id
});

const toggleGoalAction = id => ({
  type: "TOGGLE_GOAL",
  id
});

const goalReducer = (state, action) => {
  let index;

  switch (action.type) {
    case "ADD_GOAL":
      return [...state, action.goal];

    case "REMOVE_GOAL":
      index = state.findIndex(goal => goal.id === action.id);
      state.splice(index, 1);
      return state;

    case "TOGGLE_GOAL":
      index = state.findIndex(goal => goal.id === action.id);
      state[index].completed = !state[index].completed;
      console.log("goal reducer triggered");
      return state;
  }
};

const rootReducer2 = (state = {}, action) => {
  return {
    goals: goalReducer(state.goals, action),
    todos: todos(state.todos, action)
  };
};

store.dispatch(
  addGoalAction({
    description: "Joa muss",
    id: "1234wtrsfdjhknw",
    completed: false
  })
);
store.dispatch(
  addTodoAction({
    id: "sdwe7868e",
    description: "Muell rausbringen",
    completed: false
  })
);

//website js

const addTodoHandler = () => {
  console.log("clicked");
  let todoInput = document.querySelector("#todo");
  store.dispatch(
    addTodoAction({
      description: todoInput.value,
      completed: false,
      id: Helper.generateId()
    })
  );

  todoInput.value = "";
};

const addGoalHandler = () => {
  console.log("clicked");
  let goalInput = document.querySelector("#goal");
  store.dispatch(
    addGoalAction({
      description: goalInput.value,
      completed: false,
      id: Helper.generateId()
    })
  );
  goalInput.value = "";
};

const renderTodosToDOM = () => {
  const todolist = document.querySelector("#todolist");
  //create list items for the todos of state
  const childs = store.getState().todos.map(todo => {
    let li = document.createElement("li");
    let text = document.createTextNode(todo.description);
    li.appendChild(text);
    //add remove button
    let removeButton = Helper.createRemoveButton(() =>
      store.dispatch(removeTodoAction(todo.id))
    );
    li.appendChild(removeButton);
    li.style.cursor = "pointer";
    li.style.textDecoration = todo.completed ? "line-through" : "";
    li.addEventListener("click", () => {
      store.dispatch(toggleTodoAction(todo.id));
      console.log("clicked");
    });
    return li;
  });
  todolist.textContent = "";
  childs.forEach(child => todolist.append(child));
  // todolist.appendChild(childs);
};

const renderGoalsToDOM = () => {
  const goallist = document.querySelector("#goallist");
  //create list items for the todos of state
  const childs = store.getState().goals.map(goal => {
    let li = document.createElement("li");
    let text = document.createTextNode(goal.description);
    li.appendChild(text);
    //add remove button
    li.appendChild(
      Helper.createRemoveButton(() => store.dispatch(removeGoalAction(goal.id)))
    );
    li.style.cursor = "pointer";
    li.style.textDecoration = goal.completed ? "line-through" : "";
    //update state
    li.addEventListener("click", () =>
      store.dispatch(toggleGoalAction(goal.id))
    );
    return li;
  });
  goallist.textContent = "";
  childs.forEach(child => goallist.append(child));
  // todolist.appendChild(childs);
};

const render = () => {
  renderTodosToDOM();
  renderGoalsToDOM();
};

store.subscribe(() => render());

// EVENT LISTENEERS
document
  .querySelector("#goalbutton")
  .addEventListener("click", () => addGoalHandler());
document
  .querySelector("#todobutton")
  .addEventListener("click", () => addTodoHandler());
