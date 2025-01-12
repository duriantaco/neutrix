import{_ as n,c as a,a0 as p,o as e}from"./chunks/framework.CMtr6uOw.js";const g=JSON.parse('{"title":"Redux vs neutrix: Boilerplate Comparison","description":"","frontmatter":{},"headers":[],"relativePath":"comparison/comparison.md","filePath":"comparison/comparison.md"}'),t={name:"comparison/comparison.md"};function l(i,s,r,c,o,d){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="redux-vs-neutrix-boilerplate-comparison" tabindex="-1">Redux vs neutrix: Boilerplate Comparison <a class="header-anchor" href="#redux-vs-neutrix-boilerplate-comparison" aria-label="Permalink to &quot;Redux vs neutrix: Boilerplate Comparison&quot;">​</a></h1><h2 id="real-world-user-management-example" tabindex="-1">Real-world User Management Example <a class="header-anchor" href="#real-world-user-management-example" aria-label="Permalink to &quot;Real-world User Management Example&quot;">​</a></h2><p>Let&#39;s implement a user auth system with loading states, error handling, and profile updates in redux first then neutrix:</p><h3 id="redux-implementation" tabindex="-1">Redux Implementation <a class="header-anchor" href="#redux-implementation" aria-label="Permalink to &quot;Redux Implementation&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Action Types</span></span>
<span class="line"><span>const USER_LOGIN_START = &#39;user/loginStart&#39;</span></span>
<span class="line"><span>const USER_LOGIN_SUCCESS = &#39;user/loginSuccess&#39;</span></span>
<span class="line"><span>const USER_LOGIN_FAIL = &#39;user/loginFail&#39;</span></span>
<span class="line"><span>const USER_UPDATE_START = &#39;user/updateStart&#39;</span></span>
<span class="line"><span>const USER_UPDATE_SUCCESS = &#39;user/updateSuccess&#39;</span></span>
<span class="line"><span>const USER_UPDATE_FAIL = &#39;user/updateFail&#39;</span></span>
<span class="line"><span>const USER_LOGOUT = &#39;user/logout&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Action Creators</span></span>
<span class="line"><span>const loginStart = () =&gt; ({ type: USER_LOGIN_START })</span></span>
<span class="line"><span>const loginSuccess = (user) =&gt; ({ type: USER_LOGIN_SUCCESS, payload: user })</span></span>
<span class="line"><span>const loginFail = (error) =&gt; ({ type: USER_LOGIN_FAIL, payload: error })</span></span>
<span class="line"><span>const updateStart = () =&gt; ({ type: USER_UPDATE_START })</span></span>
<span class="line"><span>const updateSuccess = (user) =&gt; ({ type: USER_UPDATE_SUCCESS, payload: user })</span></span>
<span class="line"><span>const updateFail = (error) =&gt; ({ type: USER_UPDATE_FAIL, payload: error })</span></span>
<span class="line"><span>const logout = () =&gt; ({ type: USER_LOGOUT })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Thunk Actions</span></span>
<span class="line"><span>const loginUser = (credentials) =&gt; async (dispatch) =&gt; {</span></span>
<span class="line"><span>  dispatch(loginStart())</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    const user = await api.login(credentials)</span></span>
<span class="line"><span>    dispatch(loginSuccess(user))</span></span>
<span class="line"><span>  } catch (error) {</span></span>
<span class="line"><span>    dispatch(loginFail(error.message))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const updateUser = (userId, data) =&gt; async (dispatch) =&gt; {</span></span>
<span class="line"><span>  dispatch(updateStart())</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    const updated = await api.updateUser(userId, data)</span></span>
<span class="line"><span>    dispatch(updateSuccess(updated))</span></span>
<span class="line"><span>  } catch (error) {</span></span>
<span class="line"><span>    dispatch(updateFail(error.message))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Reducer</span></span>
<span class="line"><span>const initialState = {</span></span>
<span class="line"><span>  user: null,</span></span>
<span class="line"><span>  loading: false,</span></span>
<span class="line"><span>  error: null,</span></span>
<span class="line"><span>  updateLoading: false,</span></span>
<span class="line"><span>  updateError: null</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const userReducer = (state = initialState, action) =&gt; {</span></span>
<span class="line"><span>  switch (action.type) {</span></span>
<span class="line"><span>    case USER_LOGIN_START:</span></span>
<span class="line"><span>      return { ...state, loading: true, error: null }</span></span>
<span class="line"><span>    case USER_LOGIN_SUCCESS:</span></span>
<span class="line"><span>      return { ...state, loading: false, user: action.payload }</span></span>
<span class="line"><span>    case USER_LOGIN_FAIL:</span></span>
<span class="line"><span>      return { ...state, loading: false, error: action.payload }</span></span>
<span class="line"><span>    case USER_UPDATE_START:</span></span>
<span class="line"><span>      return { ...state, updateLoading: true, updateError: null }</span></span>
<span class="line"><span>    case USER_UPDATE_SUCCESS:</span></span>
<span class="line"><span>      return { ...state, updateLoading: false, user: action.payload }</span></span>
<span class="line"><span>    case USER_UPDATE_FAIL:</span></span>
<span class="line"><span>      return { ...state, updateLoading: false, updateError: action.payload }</span></span>
<span class="line"><span>    case USER_LOGOUT:</span></span>
<span class="line"><span>      return initialState</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>      return state</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Selectors</span></span>
<span class="line"><span>const selectUser = state =&gt; state.user.user</span></span>
<span class="line"><span>const selectLoading = state =&gt; state.user.loading</span></span>
<span class="line"><span>const selectError = state =&gt; state.user.error</span></span>
<span class="line"><span>const selectUpdateLoading = state =&gt; state.user.updateLoading</span></span></code></pre></div><h3 id="neutrix-implementation" tabindex="-1">neutrix Implementation <a class="header-anchor" href="#neutrix-implementation" aria-label="Permalink to &quot;neutrix Implementation&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const store = createStore({</span></span>
<span class="line"><span>  user: null,</span></span>
<span class="line"><span>  loading: false,</span></span>
<span class="line"><span>  error: null,</span></span>
<span class="line"><span>  updateLoading: false,</span></span>
<span class="line"><span>  updateError: null</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const loginUser = store.action(</span></span>
<span class="line"><span>  async (store, credentials) =&gt; {</span></span>
<span class="line"><span>    store.set(&#39;loading&#39;, true)</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const user = await api.login(credentials)</span></span>
<span class="line"><span>      store.set(&#39;user&#39;, user)</span></span>
<span class="line"><span>    } catch (error) {</span></span>
<span class="line"><span>      store.set(&#39;error&#39;, error.message)</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      store.set(&#39;loading&#39;, false)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const updateUser = store.action(</span></span>
<span class="line"><span>  async (store, userId, data) =&gt; {</span></span>
<span class="line"><span>    store.set(&#39;updateLoading&#39;, true)</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const updated = await api.updateUser(userId, data)</span></span>
<span class="line"><span>      store.set(&#39;user&#39;, updated)</span></span>
<span class="line"><span>    } catch (error) {</span></span>
<span class="line"><span>      store.set(&#39;updateError&#39;, error.message)</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      store.set(&#39;updateLoading&#39;, false)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>Redux is cumbersome and difficult to use. It consists of the following:</p><ul><li>Action Types that define the possible state transitions</li><li>Action Creators that generate action objects</li><li>Thunk Actions for handling async operations</li><li>A Reducer that manages state updates</li><li>Selectors for accessing state values</li></ul><p>Redux requires a lot more boilerplate code.</p><p>neutrix offers a more streamlined approach:</p><ul><li>Direct store creation with initial state</li><li>Actions that can directly modify the store</li><li>Built-in async handling without additional middleware</li><li>neutrix reduces boilerplate by allowing direct state mutations through <code>store.set()</code> and handling loading/error states in a more straightforward way using try/catch/finally blocks.</li></ul><h2 id="simple-counter" tabindex="-1">Simple Counter <a class="header-anchor" href="#simple-counter" aria-label="Permalink to &quot;Simple Counter&quot;">​</a></h2><h3 id="redux-implementation-1" tabindex="-1">Redux Implementation <a class="header-anchor" href="#redux-implementation-1" aria-label="Permalink to &quot;Redux Implementation&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Action Types</span></span>
<span class="line"><span>const INCREMENT = &#39;counter/increment&#39;</span></span>
<span class="line"><span>const DECREMENT = &#39;counter/decrement&#39;</span></span>
<span class="line"><span>const SET_COUNT = &#39;counter/set&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Action Creators</span></span>
<span class="line"><span>const increment = () =&gt; ({ type: INCREMENT })</span></span>
<span class="line"><span>const decrement = () =&gt; ({ type: DECREMENT })</span></span>
<span class="line"><span>const setCount = (value) =&gt; ({ type: SET_COUNT, payload: value })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Reducer</span></span>
<span class="line"><span>const counterReducer = (state = 0, action) =&gt; {</span></span>
<span class="line"><span>  switch (action.type) {</span></span>
<span class="line"><span>    case INCREMENT:</span></span>
<span class="line"><span>      return state + 1</span></span>
<span class="line"><span>    case DECREMENT:</span></span>
<span class="line"><span>      return state - 1</span></span>
<span class="line"><span>    case SET_COUNT:</span></span>
<span class="line"><span>      return action.payload</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>      return state</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Component</span></span>
<span class="line"><span>function Counter() {</span></span>
<span class="line"><span>  const count = useSelector(state =&gt; state.counter)</span></span>
<span class="line"><span>  const dispatch = useDispatch()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;div&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; dispatch(decrement())}&gt;-&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;span&gt;{count}&lt;/span&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; dispatch(increment())}&gt;+&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; dispatch(setCount(0))}&gt;Reset&lt;/button&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="neutrix-implementation-1" tabindex="-1">neutrix Implementation <a class="header-anchor" href="#neutrix-implementation-1" aria-label="Permalink to &quot;neutrix Implementation&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const store = createStore({ count: 0 })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function Counter() {</span></span>
<span class="line"><span>  const count = useStore(store =&gt; store.get(&#39;count&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;div&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; store.set(&#39;count&#39;, count - 1)}&gt;-&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;span&gt;{count}&lt;/span&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; store.set(&#39;count&#39;, count + 1)}&gt;+&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; store.set(&#39;count&#39;, 0)}&gt;Reset&lt;/button&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><table tabindex="0"><thead><tr><th>Feature</th><th>Redux</th><th>neutrix</th><th>Winner</th></tr></thead><tbody><tr><td><strong>Setup Code</strong></td><td>Requires store setup, middleware configuration, root reducer, dev tools setup</td><td>Single createStore call with options</td><td>neutrix</td></tr><tr><td><strong>State Updates</strong></td><td>Action creators + reducer + dispatch</td><td>Direct store.set() calls</td><td>neutrix</td></tr><tr><td><strong>Async Operations</strong></td><td>Requires middleware (thunk/saga), multiple action types, action creators</td><td>Built-in action system</td><td>neutrix</td></tr><tr><td><strong>TypeScript Support</strong></td><td>Requires additional type definitions and utilities</td><td>Built-in TypeScript support</td><td>neutrix</td></tr><tr><td><strong>DevTools</strong></td><td>Built-in extensive support</td><td>Basic support through options</td><td>Redux</td></tr><tr><td><strong>Middleware</strong></td><td>Rich ecosystem, highly customizable</td><td>Basic middleware system</td><td>Redux</td></tr><tr><td><strong>State Persistence</strong></td><td>Requires additional packages (redux-persist)</td><td>Built-in persistence support</td><td>neutrix</td></tr><tr><td><strong>Computed Values</strong></td><td>Requires reselect or manual memoization</td><td>Built-in computed system</td><td>neutrix</td></tr><tr><td><strong>Learning Curve</strong></td><td>Steep (actions, reducers, middleware concepts)</td><td>Gentle (simple get/set API)</td><td>neutrix</td></tr><tr><td><strong>Ecosystem</strong></td><td>Very large, mature ecosystem</td><td>Newer, smaller ecosystem</td><td>Redux</td></tr></tbody></table>`,18)]))}const m=n(t,[["render",l]]);export{g as __pageData,m as default};
