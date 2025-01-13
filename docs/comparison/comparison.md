# Redux vs neutrix: Boilerplate Comparison

## Real-world User Management Example

Let's implement a user auth system with loading states, error handling, and profile updates in redux first then neutrix:

### Redux Implementation

```
// Action Types
const USER_LOGIN_START = 'user/loginStart'
const USER_LOGIN_SUCCESS = 'user/loginSuccess'
const USER_LOGIN_FAIL = 'user/loginFail'
const USER_UPDATE_START = 'user/updateStart'
const USER_UPDATE_SUCCESS = 'user/updateSuccess'
const USER_UPDATE_FAIL = 'user/updateFail'
const USER_LOGOUT = 'user/logout'

// Action Creators
const loginStart = () => ({ type: USER_LOGIN_START })
const loginSuccess = (user) => ({ type: USER_LOGIN_SUCCESS, payload: user })
const loginFail = (error) => ({ type: USER_LOGIN_FAIL, payload: error })
const updateStart = () => ({ type: USER_UPDATE_START })
const updateSuccess = (user) => ({ type: USER_UPDATE_SUCCESS, payload: user })
const updateFail = (error) => ({ type: USER_UPDATE_FAIL, payload: error })
const logout = () => ({ type: USER_LOGOUT })

// Thunk Actions
const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart())
  try {
    const user = await api.login(credentials)
    dispatch(loginSuccess(user))
  } catch (error) {
    dispatch(loginFail(error.message))
  }
}

const updateUser = (userId, data) => async (dispatch) => {
  dispatch(updateStart())
  try {
    const updated = await api.updateUser(userId, data)
    dispatch(updateSuccess(updated))
  } catch (error) {
    dispatch(updateFail(error.message))
  }
}

// Reducer
const initialState = {
  user: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_START:
      return { ...state, loading: true, error: null }
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload }
    case USER_UPDATE_START:
      return { ...state, updateLoading: true, updateError: null }
    case USER_UPDATE_SUCCESS:
      return { ...state, updateLoading: false, user: action.payload }
    case USER_UPDATE_FAIL:
      return { ...state, updateLoading: false, updateError: action.payload }
    case USER_LOGOUT:
      return initialState
    default:
      return state
  }
}

// Selectors
const selectUser = state => state.user.user
const selectLoading = state => state.user.loading
const selectError = state => state.user.error
const selectUpdateLoading = state => state.user.updateLoading
```

### neutrix Implementation
```
const store = createStore({
  user: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
})

const loginUser = store.action(
  async (store, credentials) => {
    store.set('loading', true)
    try {
      const user = await api.login(credentials)
      store.set('user', user)
    } catch (error) {
      store.set('error', error.message)
    } finally {
      store.set('loading', false)
    }
  }
)

const updateUser = store.action(
  async (store, userId, data) => {
    store.set('updateLoading', true)
    try {
      const updated = await api.updateUser(userId, data)
      store.set('user', updated)
    } catch (error) {
      store.set('updateError', error.message)
    } finally {
      store.set('updateLoading', false)
    }
  }
)
```

Redux is cumbersome and difficult to use. It consists of the following: 

* Action Types that define the possible state transitions
* Action Creators that generate action objects
* Thunk Actions for handling async operations
* A Reducer that manages state updates
* Selectors for accessing state values

Redux requires a lot more boilerplate code. 

neutrix offers a more streamlined approach:

* Direct store creation with initial state
* Actions that can directly modify the store
* Built-in async handling without additional middleware
* neutrix reduces boilerplate by allowing direct state mutations through `store.set()` and handling loading/error states in a more straightforward way using try/catch/finally blocks. 

## Simple Counter

### Redux Implementation

```
// Action Types
const INCREMENT = 'counter/increment'
const DECREMENT = 'counter/decrement'
const SET_COUNT = 'counter/set'

// Action Creators
const increment = () => ({ type: INCREMENT })
const decrement = () => ({ type: DECREMENT })
const setCount = (value) => ({ type: SET_COUNT, payload: value })

// Reducer
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    case SET_COUNT:
      return action.payload
    default:
      return state
  }
}

// Component
function Counter() {
  const count = useSelector(state => state.counter)
  const dispatch = useDispatch()

  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(setCount(0))}>Reset</button>
    </div>
  )
}
```

### neutrix Implementation

```
const store = createStore({ count: 0 })

function Counter() {
  const count = useStore(store => store.get('count'))

  return (
    <div>
      <button onClick={() => store.set('count', count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => store.set('count', count + 1)}>+</button>
      <button onClick={() => store.set('count', 0)}>Reset</button>
    </div>
  )
}
```

| Feature | neutrix | Redux | Redux Toolkit | MobX |
|---------|---------|--------|----------------|-------|
| **Setup Code** | Single createStore call with options | Requires store setup, middleware configuration, root reducer | Simplified with configureStore | Minimal setup with makeObservable/makeAutoObservable |
| **State Updates** | Direct store.set() with path access | Action creators + reducer + dispatch | CreateSlice with reducers | Direct mutations with observable state |
| **Async Operations** | Built-in action system with suspense support | Requires thunk/saga middleware | Built-in thunk and createAsyncThunk | Async actions with runInAction |
| **TypeScript Support** | Native TypeScript support with path inference | Manual type definitions needed | Improved TS support with built-in types | Decorator-based type system |
| **DevTools Integration** | Redux DevTools support | Extensive Redux DevTools support | Same Redux DevTools support | MobX DevTools and Redux DevTools |
| **Middleware System** | Simple middleware with get/set hooks | Highly flexible middleware chain | Pre-configured middleware, extensible | Limited middleware support |
| **State Persistence** | Built-in persistence options | Requires redux-persist | Requires redux-persist | Requires manual implementation |
| **Computed Values** | Built-in computed system with LRU cache | Requires reselect | Requires reselect | Built-in computed values |
| **Learning Curve** | Simple get/set API with familiar patterns | Many concepts (actions, reducers, middleware) | Simplified Redux concepts | Observable concepts, reactions, actions |
| **Ecosystem** | Newer, smaller ecosystem | Large, mature ecosystem | Same as Redux | Medium-sized ecosystem |