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

const store = createStore(rootReducer);

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
  type: "TOGGLE_TODO",
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
  addGoalAction({ titl: "Joa muss", id: "1234wtrsfdjhknw", completed: false })
);
store.dispatch(
  addTodoAction({
    id: "sdwe7868e",
    description: "Muell rausbringen",
    completed: false
  })
);
