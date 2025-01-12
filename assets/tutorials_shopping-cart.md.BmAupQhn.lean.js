import{_ as a,c as n,a0 as p,o as t}from"./chunks/framework.CB8VgNwK.js";const h=JSON.parse('{"title":"Building an E-commerce App with neutrix","description":"","frontmatter":{},"headers":[],"relativePath":"tutorials/shopping-cart.md","filePath":"tutorials/shopping-cart.md"}'),e={name:"tutorials/shopping-cart.md"};function l(i,s,o,c,r,u){return t(),n("div",null,s[0]||(s[0]=[p(`<h1 id="building-an-e-commerce-app-with-neutrix" tabindex="-1">Building an E-commerce App with neutrix <a class="header-anchor" href="#building-an-e-commerce-app-with-neutrix" aria-label="Permalink to &quot;Building an E-commerce App with neutrix&quot;">​</a></h1><h2 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h2><p>In this tutorial, we&#39;ll build a complete e-commerce application using neutrix for state management. You&#39;ll learn how to:</p><ul><li>Set up a neutrix store with TypeScript</li><li>Manage shopping cart state</li><li>Create computed values for calculations</li><li>Persist user&#39;s cart data</li><li>Build reusable React components</li></ul><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><ul><li>Basic knowledge of React and TypeScript</li><li>Node.js installed on your machine</li><li>An IDE</li></ul><h2 id="project-setup" tabindex="-1">Project Setup <a class="header-anchor" href="#project-setup" aria-label="Permalink to &quot;Project Setup&quot;">​</a></h2><p>We do have a full working example inside /examples so you can clone it into your repo and try it for yourself. Alternatively if you want to follow along, you can proceed on below.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npm create vite@latest shop-app -- --template react-ts</span></span>
<span class="line"><span>cd shop-app</span></span>
<span class="line"><span>npm install neutrix react-router-dom</span></span></code></pre></div><h2 id="core-components" tabindex="-1">Core components <a class="header-anchor" href="#core-components" aria-label="Permalink to &quot;Core components&quot;">​</a></h2><p>Core Components:</p><ul><li>App.tsx: Main application component</li><li>Header.tsx: Navigation header with cart total</li><li>CartDrawer.tsx: Sliding cart panel</li><li>ShopContent.tsx: Main product listing</li><li>WishList.tsx: Wishlist feature</li><li>storeExample.ts: State management</li></ul><h2 id="tutorial" tabindex="-1">Tutorial <a class="header-anchor" href="#tutorial" aria-label="Permalink to &quot;Tutorial&quot;">​</a></h2><h3 id="setting-up-the-store" tabindex="-1">Setting up the store <a class="header-anchor" href="#setting-up-the-store" aria-label="Permalink to &quot;Setting up the store&quot;">​</a></h3><ol><li>First, we define the structure of our data. Every product in our store has three basic properties: an ID, a name, and price. The store holds three main pieces of information. It keeps track of all our products, manages our shopping cart, and handles some UI states like whether the cart drawer is visible. neutrix needs these TypeScript interfaces to properly type our store data.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export interface Product {</span></span>
<span class="line"><span>  id: number</span></span>
<span class="line"><span>  name: string</span></span>
<span class="line"><span>  price: number</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export interface ShopState extends State {</span></span>
<span class="line"><span>  products: Product[]</span></span>
<span class="line"><span>  cart: { [id: number]: number } </span></span>
<span class="line"><span>  ui: {</span></span>
<span class="line"><span>    isCartOpen: boolean</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>When we create the store with persist: true, neutrix automatically handles saving our cart data to localStorage - so if someone refreshes their browser, they won&#39;t lose their cart items.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Sample products data</span></span>
<span class="line"><span>const sampleProducts: Product[] = [</span></span>
<span class="line"><span>  { id: 1, name: &quot;Mechanical Keyboard&quot;, price: 149.99 },</span></span>
<span class="line"><span>  { id: 2, name: &quot;Gaming Mouse&quot;, price: 59.99 },</span></span>
<span class="line"><span>  { id: 3, name: &quot;Monitor&quot;, price: 299.99 }</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Initial state</span></span>
<span class="line"><span>const initialState: ShopState = {</span></span>
<span class="line"><span>  products: sampleProducts,</span></span>
<span class="line"><span>  cart: {},  // Empty cart to start</span></span>
<span class="line"><span>  ui: {</span></span>
<span class="line"><span>    isCartOpen: false</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const store = createStore&lt;ShopState&gt;(initialState, {</span></span>
<span class="line"><span>  persist: true,   &lt; --- save to localstorage</span></span>
<span class="line"><span>  name: &#39;shop-store&#39;</span></span>
<span class="line"><span>})</span></span></code></pre></div><ol start="3"><li>For the cart portion, instead of keeping an array of items, we use an object where each key is a product ID and each value is the quantity. This makes it super easy to update quantities without having to search through arrays. When we want to modify the cart, we use neutrix&#39;s <code>store.get()</code> to grab the current cart state and <code>store.set()</code> to update it. neutrix will automatically notify any components using this cart data that they need to update.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export const addToCart = (productId: number) =&gt; {</span></span>
<span class="line"><span>  const cart = store.get(&#39;cart&#39;)</span></span>
<span class="line"><span>  const currentQuantity = cart[productId] || 0</span></span>
<span class="line"><span>  store.set(&#39;cart&#39;, {</span></span>
<span class="line"><span>    ...cart,</span></span>
<span class="line"><span>    [productId]: currentQuantity + 1</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const removeFromCart = (productId: number) =&gt; {</span></span>
<span class="line"><span>  const cart = store.get(&#39;cart&#39;)</span></span>
<span class="line"><span>  const currentQuantity = cart[productId] || 0</span></span>
<span class="line"><span>  if (currentQuantity &gt; 0) {</span></span>
<span class="line"><span>    store.set(&#39;cart&#39;, {</span></span>
<span class="line"><span>      ...cart,</span></span>
<span class="line"><span>      [productId]: currentQuantity - 1</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>Finally, we use neutrix&#39;s <code>computed</code> feature to create a value that automatically recalculates when the cart changes. Any component using this cartTotal will automatically re-render when needed. It tracks dependencies and updates only when necessary.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export const cartTotal = store.computed(&#39;cartTotal&#39;, (state: ShopState) =&gt; {</span></span>
<span class="line"><span>  return Object.entries(state.cart).reduce((total, [productId, quantity]) =&gt; {</span></span>
<span class="line"><span>    const product = state.products.find(p =&gt; p.id === Number(productId))</span></span>
<span class="line"><span>    if (product) {</span></span>
<span class="line"><span>      return total + (product.price * quantity)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return total</span></span>
<span class="line"><span>  }, 0)</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>Full example below:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// storeExample.ts</span></span>
<span class="line"><span>import { createStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import type { State } from &#39;neutrix&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Define our Product type</span></span>
<span class="line"><span>export interface Product {</span></span>
<span class="line"><span>  id: number</span></span>
<span class="line"><span>  name: string</span></span>
<span class="line"><span>  price: number</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Define our entire store state structure</span></span>
<span class="line"><span>export interface ShopState extends State {</span></span>
<span class="line"><span>  products: Product[]</span></span>
<span class="line"><span>  cart: { [id: number]: number }  // productId: quantity</span></span>
<span class="line"><span>  ui: {</span></span>
<span class="line"><span>    isCartOpen: boolean</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Sample products data</span></span>
<span class="line"><span>const sampleProducts: Product[] = [</span></span>
<span class="line"><span>  { id: 1, name: &quot;Mechanical Keyboard&quot;, price: 149.99 },</span></span>
<span class="line"><span>  { id: 2, name: &quot;Gaming Mouse&quot;, price: 59.99 },</span></span>
<span class="line"><span>  { id: 3, name: &quot;Monitor&quot;, price: 299.99 }</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Initial state</span></span>
<span class="line"><span>const initialState: ShopState = {</span></span>
<span class="line"><span>  products: sampleProducts,</span></span>
<span class="line"><span>  cart: {},  // Empty cart to start</span></span>
<span class="line"><span>  ui: {</span></span>
<span class="line"><span>    isCartOpen: false</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Create and export our store</span></span>
<span class="line"><span>export const store = createStore&lt;ShopState&gt;(initialState, {</span></span>
<span class="line"><span>  persist: true,  // Save to localStorage</span></span>
<span class="line"><span>  name: &#39;shop-store&#39;</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Cart Operations</span></span>
<span class="line"><span>export const addToCart = (productId: number) =&gt; {</span></span>
<span class="line"><span>  const cart = store.get(&#39;cart&#39;)</span></span>
<span class="line"><span>  const currentQuantity = cart[productId] || 0</span></span>
<span class="line"><span>  store.set(&#39;cart&#39;, {</span></span>
<span class="line"><span>    ...cart,</span></span>
<span class="line"><span>    [productId]: currentQuantity + 1</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const removeFromCart = (productId: number) =&gt; {</span></span>
<span class="line"><span>  const cart = store.get(&#39;cart&#39;)</span></span>
<span class="line"><span>  const currentQuantity = cart[productId] || 0</span></span>
<span class="line"><span>  if (currentQuantity &gt; 0) {</span></span>
<span class="line"><span>    store.set(&#39;cart&#39;, {</span></span>
<span class="line"><span>      ...cart,</span></span>
<span class="line"><span>      [productId]: currentQuantity - 1</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// UI Operations</span></span>
<span class="line"><span>export const toggleCart = () =&gt; {</span></span>
<span class="line"><span>  const isOpen = store.get(&#39;ui.isCartOpen&#39;)</span></span>
<span class="line"><span>  store.set(&#39;ui.isCartOpen&#39;, !isOpen)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Computed Values</span></span>
<span class="line"><span>export const cartTotal = store.computed(&#39;cartTotal&#39;, (state: ShopState) =&gt; {</span></span>
<span class="line"><span>  return Object.entries(state.cart).reduce((total, [productId, quantity]) =&gt; {</span></span>
<span class="line"><span>    const product = state.products.find(p =&gt; p.id === Number(productId))</span></span>
<span class="line"><span>    if (product) {</span></span>
<span class="line"><span>      return total + (product.price * quantity)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return total</span></span>
<span class="line"><span>  }, 0)</span></span>
<span class="line"><span>})</span></span></code></pre></div><h3 id="setting-up-the-header" tabindex="-1">Setting up the Header <a class="header-anchor" href="#setting-up-the-header" aria-label="Permalink to &quot;Setting up the Header&quot;">​</a></h3><p>This part is the most straightforward. We&#39;ll use neutrix&#39;s <code>useStore</code> hook to subscribe to our cartTotal computed value. When the cart changes, neutrix will automatically update our total value.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import { cartTotal, toggleCart } from &#39;./storeExample&#39;</span></span>
<span class="line"><span>import type { ShopState } from &#39;./storeExample&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function Header() {</span></span>
<span class="line"><span>  const total = useStore&lt;ShopState, number&gt;(() =&gt; cartTotal())</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;div style={{</span></span>
<span class="line"><span>      padding: &#39;1rem&#39;,</span></span>
<span class="line"><span>      borderBottom: &#39;1px solid #eee&#39;,</span></span>
<span class="line"><span>      display: &#39;flex&#39;,</span></span>
<span class="line"><span>      justifyContent: &#39;space-between&#39;</span></span>
<span class="line"><span>    }}&gt;</span></span>
<span class="line"><span>      &lt;h1&gt;Shop&lt;/h1&gt;</span></span>
<span class="line"><span>      &lt;div&gt;</span></span>
<span class="line"><span>        &lt;span&gt;Total: \${total.toFixed(2)} &lt;/span&gt;</span></span>
<span class="line"><span>        &lt;button onClick={toggleCart}&gt;🛒&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="cart-drawer" tabindex="-1">Cart drawer <a class="header-anchor" href="#cart-drawer" aria-label="Permalink to &quot;Cart drawer&quot;">​</a></h3><ol><li>Component Setup and Store Connection</li></ol><p>First, we hook up our component to all the store data it needs. neutrix will automatically re-render the component when values change.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export function CartDrawer() {</span></span>
<span class="line"><span>  const isOpen = useStore&lt;ShopState, boolean&gt;(store =&gt; store.get(&#39;ui.isCartOpen&#39;))</span></span>
<span class="line"><span>  const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span>  const products = useStore&lt;ShopState, Product[]&gt;(store =&gt; store.get(&#39;products&#39;))</span></span>
<span class="line"><span>  const total = useStore&lt;ShopState, number&gt;(() =&gt; cartTotal())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (!isOpen) return null;</span></span></code></pre></div><p>Full code below:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// CartDrawer.tsx</span></span>
<span class="line"><span>import { useStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import { cartTotal, toggleCart, removeFromCart } from &#39;./storeExample&#39;</span></span>
<span class="line"><span>import type { ShopState, Product } from &#39;./storeExample&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function CartDrawer() {</span></span>
<span class="line"><span>  const isOpen = useStore&lt;ShopState, boolean&gt;(store =&gt; store.get(&#39;ui.isCartOpen&#39;))</span></span>
<span class="line"><span>  const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span>  const products = useStore&lt;ShopState, Product[]&gt;(store =&gt; store.get(&#39;products&#39;))</span></span>
<span class="line"><span>  const total = useStore&lt;ShopState, number&gt;(() =&gt; cartTotal())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (!isOpen) return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;div style={{</span></span>
<span class="line"><span>      position: &#39;fixed&#39;,</span></span>
<span class="line"><span>      right: 0,</span></span>
<span class="line"><span>      top: 0,</span></span>
<span class="line"><span>      bottom: 0,</span></span>
<span class="line"><span>      width: &#39;300px&#39;,</span></span>
<span class="line"><span>      backgroundColor: &#39;white&#39;,</span></span>
<span class="line"><span>      boxShadow: &#39;-2px 0 5px rgba(0,0,0,0.1)&#39;,</span></span>
<span class="line"><span>      padding: &#39;1rem&#39;,</span></span>
<span class="line"><span>      zIndex: 1000</span></span>
<span class="line"><span>    }}&gt;</span></span>
<span class="line"><span>      &lt;div style={{ display: &#39;flex&#39;, justifyContent: &#39;space-between&#39; }}&gt;</span></span>
<span class="line"><span>        &lt;h2&gt;Cart&lt;/h2&gt;</span></span>
<span class="line"><span>        &lt;button onClick={toggleCart}&gt;✕&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      {Object.entries(cart).map(([productId, quantity]) =&gt; {</span></span>
<span class="line"><span>        const product = products.find(p =&gt; p.id === Number(productId))</span></span>
<span class="line"><span>        if (!product || quantity === 0) return null</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        return (</span></span>
<span class="line"><span>          &lt;div key={productId} style={{ marginTop: &#39;1rem&#39; }}&gt;</span></span>
<span class="line"><span>            &lt;div&gt;{product.name}&lt;/div&gt;</span></span>
<span class="line"><span>            &lt;div&gt;Quantity: {quantity}&lt;/div&gt;</span></span>
<span class="line"><span>            &lt;div&gt;\${(product.price * quantity).toFixed(2)}&lt;/div&gt;</span></span>
<span class="line"><span>            &lt;button onClick={() =&gt; removeFromCart(Number(productId))}&gt;Remove&lt;/button&gt;</span></span>
<span class="line"><span>          &lt;/div&gt;</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>      })}</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;div style={{ marginTop: &#39;2rem&#39;, borderTop: &#39;1px solid #eee&#39;, paddingTop: &#39;1rem&#39; }}&gt;</span></span>
<span class="line"><span>        &lt;strong&gt;Total: \${total.toFixed(2)}&lt;/strong&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="shop-content" tabindex="-1">Shop Content <a class="header-anchor" href="#shop-content" aria-label="Permalink to &quot;Shop Content&quot;">​</a></h3><ol><li>The ShopContent component needs access to products and cart data. Again, we use neutrix&#39;s useStore to connect to our store:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const products = useStore&lt;ShopState, Product[]&gt;(store =&gt; store.get(&#39;products&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;div className=&quot;products&quot;&gt;</span></span>
<span class="line"><span>  &lt;h2&gt;Products&lt;/h2&gt;</span></span>
<span class="line"><span>  {products.map(product =&gt; (</span></span>
<span class="line"><span>    &lt;div key={product.id} className=&quot;product&quot;&gt;</span></span>
<span class="line"><span>      &lt;h3&gt;{product.name}&lt;/h3&gt;</span></span>
<span class="line"><span>      &lt;p&gt;\${product.price}&lt;/p&gt;</span></span>
<span class="line"><span>      &lt;button onClick={() =&gt; addToCart(product.id)}&gt;Add to Cart&lt;/button&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  ))}</span></span>
<span class="line"><span>&lt;/div&gt;</span></span></code></pre></div><p>The <code>useStore</code> hook gets the products list. When addToCart is called, it updates the neutrix store and components using cart data will automatically update</p><ol start="2"><li>Multiple <code>useStore</code> hooks track cart items and total. The Cart display updates instantly when items are added or removed. Computed total recalculates automatically and will only shows products with quantities that are greater than 0.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span>const total = useStore&lt;ShopState, number&gt;(() =&gt; cartTotal())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;div className=&quot;cart&quot;&gt;</span></span>
<span class="line"><span>  &lt;h2&gt;Cart&lt;/h2&gt;</span></span>
<span class="line"><span>  {products.map(product =&gt; {</span></span>
<span class="line"><span>    const quantity = cart[product.id] || 0</span></span>
<span class="line"><span>    if (quantity === 0) return null</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return (</span></span>
<span class="line"><span>      &lt;div key={product.id} className=&quot;cart-item&quot;&gt;</span></span>
<span class="line"><span>        &lt;h3&gt;{product.name}&lt;/h3&gt;</span></span>
<span class="line"><span>        &lt;p&gt;Quantity: {quantity}&lt;/p&gt;</span></span>
<span class="line"><span>        &lt;button onClick={() =&gt; removeFromCart(product.id)}&gt;Remove&lt;/button&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>  })}</span></span>
<span class="line"><span>  &lt;div className=&quot;total&quot;&gt;</span></span>
<span class="line"><span>    &lt;h3&gt;Total: \${total.toFixed(2)}&lt;/h3&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span></code></pre></div><p>Full code below:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import { addToCart, removeFromCart, cartTotal } from &#39;./storeExample&#39;</span></span>
<span class="line"><span>import type { ShopState, Product } from &#39;./storeExample&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function ShopContent() {</span></span>
<span class="line"><span>  const products = useStore&lt;ShopState, Product[]&gt;(store =&gt; store.get(&#39;products&#39;))</span></span>
<span class="line"><span>  const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span>  const total = useStore&lt;ShopState, number&gt;(() =&gt; cartTotal())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;&gt;</span></span>
<span class="line"><span>      &lt;div className=&quot;products&quot;&gt;</span></span>
<span class="line"><span>        &lt;h2&gt;Products&lt;/h2&gt;</span></span>
<span class="line"><span>        {products.map(product =&gt; (</span></span>
<span class="line"><span>          &lt;div key={product.id} className=&quot;product&quot;&gt;</span></span>
<span class="line"><span>            &lt;h3&gt;{product.name}&lt;/h3&gt;</span></span>
<span class="line"><span>            &lt;p&gt;\${product.price}&lt;/p&gt;</span></span>
<span class="line"><span>            &lt;button onClick={() =&gt; addToCart(product.id)}&gt;Add to Cart&lt;/button&gt;</span></span>
<span class="line"><span>          &lt;/div&gt;</span></span>
<span class="line"><span>        ))}</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      &lt;div className=&quot;cart&quot;&gt;</span></span>
<span class="line"><span>        &lt;h2&gt;Cart&lt;/h2&gt;</span></span>
<span class="line"><span>        {products.map(product =&gt; {</span></span>
<span class="line"><span>          const quantity = cart[product.id] || 0</span></span>
<span class="line"><span>          if (quantity === 0) return null</span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>          return (</span></span>
<span class="line"><span>            &lt;div key={product.id} className=&quot;cart-item&quot;&gt;</span></span>
<span class="line"><span>              &lt;h3&gt;{product.name}&lt;/h3&gt;</span></span>
<span class="line"><span>              &lt;p&gt;Quantity: {quantity}&lt;/p&gt;</span></span>
<span class="line"><span>              &lt;button onClick={() =&gt; removeFromCart(product.id)}&gt;Remove&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;/div&gt;</span></span>
<span class="line"><span>          )</span></span>
<span class="line"><span>        })}</span></span>
<span class="line"><span>        &lt;div className=&quot;total&quot;&gt;</span></span>
<span class="line"><span>          &lt;h3&gt;Total: \${total.toFixed(2)}&lt;/h3&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="wish-list" tabindex="-1">Wish list <a class="header-anchor" href="#wish-list" aria-label="Permalink to &quot;Wish list&quot;">​</a></h2><ol><li>The WishList component shows what items are currently in the cart. We use neutrix&#39;s <code>useStore</code> to track cart and product data:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const products = useStore&lt;ShopState, Product[]&gt;(store =&gt; store.get(&#39;products&#39;))</span></span>
<span class="line"><span>const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;div&gt;</span></span>
<span class="line"><span>  &lt;h2&gt;Wishlist&lt;/h2&gt;</span></span>
<span class="line"><span>  &lt;div&gt;</span></span>
<span class="line"><span>    &lt;p&gt;Items in your cart while browsing wishlist:&lt;/p&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span></code></pre></div><p>Full code below:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useStore } from &#39;neutrix&#39;</span></span>
<span class="line"><span>import type { ShopState, Product } from &#39;./storeExample&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function Wishlist() {</span></span>
<span class="line"><span>  const products = useStore&lt;ShopState, Product[]&gt;(store =&gt; store.get(&#39;products&#39;))</span></span>
<span class="line"><span>  const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;div&gt;</span></span>
<span class="line"><span>      &lt;h2&gt;Wishlist&lt;/h2&gt;</span></span>
<span class="line"><span>      &lt;div&gt;</span></span>
<span class="line"><span>        &lt;p&gt;Items in your cart while browsing wishlist:&lt;/p&gt;</span></span>
<span class="line"><span>        {products.map(product =&gt; {</span></span>
<span class="line"><span>          const quantity = cart[product.id] || 0</span></span>
<span class="line"><span>          if (quantity === 0) return null;</span></span>
<span class="line"><span>          return (</span></span>
<span class="line"><span>            &lt;div key={product.id}&gt;</span></span>
<span class="line"><span>              {product.name} - Quantity: {quantity}</span></span>
<span class="line"><span>            &lt;/div&gt;</span></span>
<span class="line"><span>          )</span></span>
<span class="line"><span>        })}</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="app" tabindex="-1">App <a class="header-anchor" href="#app" aria-label="Permalink to &quot;App&quot;">​</a></h3><ol><li>Tying it up, we have to set up the main application structure with routing. The App component serves as the container for our entire application, using React Router for navigation:</li></ol><p>This is full code below:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { BrowserRouter, Routes, Route, Link } from &#39;react-router-dom&#39;</span></span>
<span class="line"><span>import { Header } from &#39;./Header&#39;</span></span>
<span class="line"><span>import { CartDrawer } from &#39;./CartDrawer&#39;</span></span>
<span class="line"><span>import { ShopContent } from &#39;./ShopContent&#39;</span></span>
<span class="line"><span>import { Wishlist } from &#39;./WishList&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function App() {</span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;BrowserRouter&gt;</span></span>
<span class="line"><span>      &lt;div className=&quot;app&quot;&gt;</span></span>
<span class="line"><span>        &lt;Header /&gt;</span></span>
<span class="line"><span>        &lt;CartDrawer /&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;nav style={{ </span></span>
<span class="line"><span>          padding: &#39;1rem&#39;, </span></span>
<span class="line"><span>          borderBottom: &#39;1px solid #eee&#39; </span></span>
<span class="line"><span>        }}&gt;</span></span>
<span class="line"><span>          &lt;Link to=&quot;/&quot; style={{ </span></span>
<span class="line"><span>            marginRight: &#39;1rem&#39;,</span></span>
<span class="line"><span>            textDecoration: &#39;none&#39;,</span></span>
<span class="line"><span>            color: &#39;#333&#39;</span></span>
<span class="line"><span>          }}&gt;</span></span>
<span class="line"><span>            Shop</span></span>
<span class="line"><span>          &lt;/Link&gt;</span></span>
<span class="line"><span>          &lt;Link to=&quot;/wishlist&quot; style={{</span></span>
<span class="line"><span>            textDecoration: &#39;none&#39;,</span></span>
<span class="line"><span>            color: &#39;#333&#39;</span></span>
<span class="line"><span>          }}&gt;</span></span>
<span class="line"><span>            Wishlist</span></span>
<span class="line"><span>          &lt;/Link&gt;</span></span>
<span class="line"><span>        &lt;/nav&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;Routes&gt;</span></span>
<span class="line"><span>          &lt;Route path=&quot;/&quot; element={&lt;ShopContent /&gt;} /&gt;</span></span>
<span class="line"><span>          &lt;Route path=&quot;/wishlist&quot; element={&lt;Wishlist /&gt;} /&gt;</span></span>
<span class="line"><span>        &lt;/Routes&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/BrowserRouter&gt;</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default App</span></span></code></pre></div><h2 id="summary" tabindex="-1">Summary <a class="header-anchor" href="#summary" aria-label="Permalink to &quot;Summary&quot;">​</a></h2><p>In summary, we have demonstrated the key features and advantages of using neutrix as a state management solution:</p><h3 id="simple-api" tabindex="-1">Simple API <a class="header-anchor" href="#simple-api" aria-label="Permalink to &quot;Simple API&quot;">​</a></h3><p>neutrix offers a straightforward API with just <code>get</code> and <code>set</code> methods, as seen in cart operations:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> const addToCart = (productId: number) =&gt; {</span></span>
<span class="line"><span>  const cart = store.get(&#39;cart&#39;)    // get current state</span></span>
<span class="line"><span>  store.set(&#39;cart&#39;, {...})          // update state</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="automatic-component-updates" tabindex="-1">Automatic Component Updates <a class="header-anchor" href="#automatic-component-updates" aria-label="Permalink to &quot;Automatic Component Updates&quot;">​</a></h3><p>Using <code>useStore</code> hook subscribes components to state changes:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const cart = useStore&lt;ShopState, Record&lt;number, number&gt;&gt;(store =&gt; store.get(&#39;cart&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Any component using this hook auto-updates when cart changes</span></span></code></pre></div><p>No need for manual re-renders or complex subscription management</p><h3 id="computed-values" tabindex="-1">Computed Values <a class="header-anchor" href="#computed-values" aria-label="Permalink to &quot;Computed Values&quot;">​</a></h3><p>Automatically calculate derived values:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const cartTotal = store.computed(&#39;cartTotal&#39;, (state: ShopState) =&gt; {</span></span>
<span class="line"><span>  return Object.entries(state.cart).reduce(...)</span></span>
<span class="line"><span>})</span></span></code></pre></div><h3 id="built-in-persistence" tabindex="-1">Built-in Persistence <a class="header-anchor" href="#built-in-persistence" aria-label="Permalink to &quot;Built-in Persistence&quot;">​</a></h3><p>Just add <code>persist: true</code> and neutrix handles saving to localStorage:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const store = createStore&lt;ShopState&gt;(initialState, {</span></span>
<span class="line"><span>  persist: true, // &lt; --- here</span></span>
<span class="line"><span>  name: &#39;shop-store&#39;</span></span>
<span class="line"><span>})</span></span></code></pre></div><h3 id="state-access-anywhere" tabindex="-1">State Access Anywhere <a class="header-anchor" href="#state-access-anywhere" aria-label="Permalink to &quot;State Access Anywhere&quot;">​</a></h3><p>Any component can access store data without prop drilling. The cart total is accessible in Header, CartDrawer, and ShopContent without passing props</p><p>This e-commerce app effectively shows how neutrix makes state management simpler compared to solutions like Redux, which would require more boilerplate code for the same functionality.</p>`,68)]))}const g=a(e,[["render",l]]);export{h as __pageData,g as default};
