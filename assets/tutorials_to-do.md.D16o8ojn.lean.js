import{_ as c,c as r,a0 as p,j as n,a as t,G as a,w as d,B as e,o as u}from"./chunks/framework.CMtr6uOw.js";const y=JSON.parse('{"title":"Building a Todo App with neutrix","description":"","frontmatter":{},"headers":[],"relativePath":"tutorials/to-do.md","filePath":"tutorials/to-do.md"}'),m={name:"tutorials/to-do.md"},h={className:"todo-app"};function g(b,s,f,x,v,T){const o=e("TodoForm"),l=e("TodoList"),i=e("StoreProvider");return u(),r("div",null,[s[3]||(s[3]=p(`<h1 id="building-a-todo-app-with-neutrix" tabindex="-1">Building a Todo App with neutrix <a class="header-anchor" href="#building-a-todo-app-with-neutrix" aria-label="Permalink to &quot;Building a Todo App with neutrix&quot;">​</a></h1><h2 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h2><p>In this tutorial, we&#39;ll build a simple but functional Todo app that showcases neutrix&#39;s key features:</p><ul><li>Simple state management with <code>get/set</code></li><li>Automatic store updates and re-rendering</li><li>Computed values</li><li>Built-in persistence</li></ul><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><ul><li>Basic knowledge of React and TypeScript</li><li>Node.js installed on your machine</li><li>An IDE</li></ul><h2 id="project-setup" tabindex="-1">Project Setup <a class="header-anchor" href="#project-setup" aria-label="Permalink to &quot;Project Setup&quot;">​</a></h2><p>We do have a full working example inside /examples so you can clone it into your repo and try it for yourself. Alternatively if you want to follow along, you can proceed on below.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npm create vite@latest todo-app -- --template react-ts</span></span>
<span class="line"><span>cd todo-app</span></span>
<span class="line"><span>npm install neutrix react-router-dom</span></span></code></pre></div><h2 id="tutorial" tabindex="-1">Tutorial <a class="header-anchor" href="#tutorial" aria-label="Permalink to &quot;Tutorial&quot;">​</a></h2><h3 id="setting-up-the-store" tabindex="-1">Setting up the store <a class="header-anchor" href="#setting-up-the-store" aria-label="Permalink to &quot;Setting up the store&quot;">​</a></h3><ol><li>First, we define our Todo type and store structure. Every todo item has an ID, text content, and completed status. The store tracks both our todos and the current filter state.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export interface Todo {</span></span>
<span class="line"><span>  id: number</span></span>
<span class="line"><span>  text: string</span></span>
<span class="line"><span>  completed: boolean</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export interface TodoState extends State {</span></span>
<span class="line"><span>  todos: Todo[]</span></span>
<span class="line"><span>  filter: &#39;all&#39; | &#39;active&#39; | &#39;completed&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>For managing todos, we create functions using neutrix&#39;s <code>store.get()</code> and <code>store.set()</code>. The addTodo function adds a new todo to the array. ToggleTodo will update a todo&#39;s completed status. neutrix will automatically notify any components using todos data that they need to update.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export const addTodo = (text: string) =&gt; {</span></span>
<span class="line"><span>  const todos = store.get(&#39;todos&#39;)</span></span>
<span class="line"><span>  store.set(&#39;todos&#39;, [</span></span>
<span class="line"><span>    ...todos,</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      id: Date.now(),</span></span>
<span class="line"><span>      text,</span></span>
<span class="line"><span>      completed: false</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ])</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const toggleTodo = (id: number) =&gt; {</span></span>
<span class="line"><span>  const todos = store.get(&#39;todos&#39;)</span></span>
<span class="line"><span>  store.set(&#39;todos&#39;, todos.map(todo =&gt; </span></span>
<span class="line"><span>    todo.id === id ? { ...todo, completed: !todo.completed } : todo</span></span>
<span class="line"><span>  ))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Full code below:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// todoStore.ts</span></span>
<span class="line"><span>import { createStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import type { State } from &#39;neutrix&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export interface Todo {</span></span>
<span class="line"><span>  id: number</span></span>
<span class="line"><span>  text: string</span></span>
<span class="line"><span>  completed: boolean</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export interface TodoState extends State {</span></span>
<span class="line"><span>  todos: Todo[]</span></span>
<span class="line"><span>  filter: &#39;all&#39; | &#39;active&#39; | &#39;completed&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const initialState: TodoState = {</span></span>
<span class="line"><span>  todos: [],</span></span>
<span class="line"><span>  filter: &#39;all&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const store = createStore&lt;TodoState&gt;(initialState, {</span></span>
<span class="line"><span>  persist: true,</span></span>
<span class="line"><span>  name: &#39;todo-store&#39;</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const addTodo = (text: string) =&gt; {</span></span>
<span class="line"><span>    const todos = store.get(&#39;todos&#39;)</span></span>
<span class="line"><span>    store.set(&#39;todos&#39;, [</span></span>
<span class="line"><span>      ...todos,</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        id: Date.now(),</span></span>
<span class="line"><span>        text,</span></span>
<span class="line"><span>        completed: false</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ])</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  export const toggleTodo = (id: number) =&gt; {</span></span>
<span class="line"><span>    const todos = store.get(&#39;todos&#39;)</span></span>
<span class="line"><span>    store.set(&#39;todos&#39;, todos.map((todo: Todo) =&gt; </span></span>
<span class="line"><span>      todo.id === id ? { ...todo, completed: !todo.completed } : todo</span></span>
<span class="line"><span>    ))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  export const setFilter = (filter: &#39;all&#39; | &#39;active&#39; | &#39;completed&#39;) =&gt; {</span></span>
<span class="line"><span>    store.set(&#39;filter&#39;, filter)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  export const filteredTodos = store.computed(&#39;filteredTodos&#39;, (state: TodoState) =&gt; {</span></span>
<span class="line"><span>    switch (state.filter) {</span></span>
<span class="line"><span>      case &#39;active&#39;:</span></span>
<span class="line"><span>        return state.todos.filter(todo =&gt; !todo.completed)</span></span>
<span class="line"><span>      case &#39;completed&#39;:</span></span>
<span class="line"><span>        return state.todos.filter(todo =&gt; todo.completed)</span></span>
<span class="line"><span>      default:</span></span>
<span class="line"><span>        return state.todos</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  })</span></span></code></pre></div><h3 id="form-component" tabindex="-1">Form component <a class="header-anchor" href="#form-component" aria-label="Permalink to &quot;Form component&quot;">​</a></h3><p>The TodoForm component is a simple form for adding new todos. Here we can see how components interact with neutrix&#39;s store through direct function calls (as you seen earlier with addToDo). No need for dispatching actions or using context. Trying to keep it simple.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useState } from &#39;react&#39;</span></span>
<span class="line"><span>import { addTodo } from &#39;./todoStore&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function TodoForm() {</span></span>
<span class="line"><span>  const [text, setText] = useState(&#39;&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const handleSubmit = (e: React.FormEvent) =&gt; {</span></span>
<span class="line"><span>    e.preventDefault()</span></span>
<span class="line"><span>    if (text.trim()) {</span></span>
<span class="line"><span>      addTodo(text)      //&lt;--- directly call your store function</span></span>
<span class="line"><span>      setText(&#39;&#39;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;form onSubmit={handleSubmit} className=&quot;todo-form&quot;&gt;</span></span>
<span class="line"><span>      &lt;input</span></span>
<span class="line"><span>        type=&quot;text&quot;</span></span>
<span class="line"><span>        value={text}</span></span>
<span class="line"><span>        onChange={(e) =&gt; setText(e.target.value)}</span></span>
<span class="line"><span>        placeholder=&quot;Add a todo&quot;</span></span>
<span class="line"><span>      /&gt;</span></span>
<span class="line"><span>      &lt;button type=&quot;submit&quot;&gt;Add&lt;/button&gt;</span></span>
<span class="line"><span>    &lt;/form&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="form-list" tabindex="-1">Form List <a class="header-anchor" href="#form-list" aria-label="Permalink to &quot;Form List&quot;">​</a></h3><p>The TodoList component shows how neutrix handles computed values and automatic updates. When we use <code>useStore</code> with our filteredTodos computed value, the component automatically re-renders whenever the todos or filter changes.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import { filteredTodos, toggleTodo, setFilter } from &#39;./todoStore&#39;</span></span>
<span class="line"><span>import type { TodoState, Todo } from &#39;./todoStore&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function TodoList() {</span></span>
<span class="line"><span>  const filteredList = useStore&lt;TodoState, Todo[]&gt;(() =&gt; filteredTodos())  // &lt;--- subscribe to computed value</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;div&gt;</span></span>
<span class="line"><span>      &lt;div className=&quot;filter-buttons&quot;&gt;</span></span>
<span class="line"><span>        &lt;button onClick={() =&gt; setFilter(&#39;all&#39;)}&gt;All&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;button onClick={() =&gt; setFilter(&#39;active&#39;)}&gt;Active&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;button onClick={() =&gt; setFilter(&#39;completed&#39;)}&gt;Completed&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      {filteredList.map(todo =&gt; (</span></span>
<span class="line"><span>        &lt;div </span></span>
<span class="line"><span>          key={todo.id} </span></span>
<span class="line"><span>          className={\`todo-item \${todo.completed ? &#39;completed&#39; : &#39;&#39;}\`}</span></span>
<span class="line"><span>        &gt;</span></span>
<span class="line"><span>          &lt;input</span></span>
<span class="line"><span>            type=&quot;checkbox&quot;</span></span>
<span class="line"><span>            checked={todo.completed}</span></span>
<span class="line"><span>            onChange={() =&gt; toggleTodo(todo.id)}   // &lt;--- Direct store update</span></span>
<span class="line"><span>          /&gt;</span></span>
<span class="line"><span>          {todo.text}</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>      ))}</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="app" tabindex="-1">App <a class="header-anchor" href="#app" aria-label="Permalink to &quot;App&quot;">​</a></h3><p>import { StoreProvider } from &#39;neutrix&#39; import { store } from &#39;./todoStore&#39; import &#39;./App.css&#39;</p>`,25)),n("p",null,[s[1]||(s[1]=t("function App() { return ( ")),a(i,{store:"{store}"},{default:d(()=>[n("div",h,[s[0]||(s[0]=n("h1",null,"Todo App",-1)),a(o),a(l)])]),_:1}),s[2]||(s[2]=t(" ) }"))]),s[4]||(s[4]=p(`<h2 id="summary" tabindex="-1">Summary <a class="header-anchor" href="#summary" aria-label="Permalink to &quot;Summary&quot;">​</a></h2><h3 id="simple-store-setup" tabindex="-1">Simple store setup <a class="header-anchor" href="#simple-store-setup" aria-label="Permalink to &quot;Simple store setup&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const store = createStore&lt;TodoState&gt;(initialState, {</span></span>
<span class="line"><span>  persist: true,  // auto persistence </span></span>
<span class="line"><span>  name: &#39;todo-store&#39;</span></span>
<span class="line"><span>})</span></span></code></pre></div><h3 id="direct-store-operations" tabindex="-1">Direct store operations <a class="header-anchor" href="#direct-store-operations" aria-label="Permalink to &quot;Direct store operations&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const addTodo = (text: string) =&gt; {</span></span>
<span class="line"><span>  const todos = store.get(&#39;todos&#39;)</span></span>
<span class="line"><span>  store.set(&#39;todos&#39;, [...todos, newTodo])</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>No need for reducers, action creators etc.</p>`,6))])}const S=c(m,[["render",g]]);export{y as __pageData,S as default};
