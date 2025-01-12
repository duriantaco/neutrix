import{_ as a,c as n,a0 as e,o as p}from"./chunks/framework.CMtr6uOw.js";const h=JSON.parse('{"title":"Actions","description":"","frontmatter":{},"headers":[],"relativePath":"guide/action.md","filePath":"guide/action.md"}'),t={name:"guide/action.md"};function l(i,s,r,c,o,d){return p(),n("div",null,s[0]||(s[0]=[e(`<h1 id="actions" tabindex="-1">Actions <a class="header-anchor" href="#actions" aria-label="Permalink to &quot;Actions&quot;">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>Actions provide a way to handle complex state changes and async operations. While simple set operations may work for basic state updates, real world apps often need to coordinate multiple changes, handle API calls, or process data before updating state. Actions solve this by providing a structured way to handle these complex operations.</p><h2 id="why-use-actions" tabindex="-1">Why Use Actions? <a class="header-anchor" href="#why-use-actions" aria-label="Permalink to &quot;Why Use Actions?&quot;">​</a></h2><p>Actions are a fundamental part of neutrix that help you manage complex state changes in a clean and maintainable way. They provide several key benefits:</p><ol><li><p>Cleaner - Actions make your code more organized and easier to maintain</p></li><li><p>Error Handling - Built-in error handling helps you manage failures gracefully</p></li><li><p>Async Support - Support for async operations like API calls</p></li><li><p>Type Safety - Full TypeScript support ensures your state updates are type-safe</p></li></ol><h2 id="basic-usage" tabindex="-1">Basic Usage <a class="header-anchor" href="#basic-usage" aria-label="Permalink to &quot;Basic Usage&quot;">​</a></h2><p>Actions combine state updates with business logic, making them perfect for handling real-world scenarios like API calls or multi-step processes.</p><p>Here&#39;s a straightforward example:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const store = createStore({</span></span>
<span class="line"><span>  users: [],</span></span>
<span class="line"><span>  loading: false,</span></span>
<span class="line"><span>  error: null</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const fetchUsers = store.action(</span></span>
<span class="line"><span>  async (store) =&gt; {</span></span>
<span class="line"><span>    store.set(&#39;loading&#39;, true)</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const response = await fetch(&#39;/api/users&#39;)</span></span>
<span class="line"><span>      const users = await response.json()</span></span>
<span class="line"><span>      store.set(&#39;users&#39;, users)</span></span>
<span class="line"><span>      store.set(&#39;error&#39;, null)</span></span>
<span class="line"><span>    } catch (err) {</span></span>
<span class="line"><span>      store.set(&#39;error&#39;, err.message)</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      store.set(&#39;loading&#39;, false)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>In this example, the action manages several aspects of data fetching:</p><ul><li>Sets a loading state before the request starts</li><li>Makes the API call and updates the users list</li><li>Handles any errors that might occur</li><li>Always ensures the loading state is cleaned up</li></ul><p>Using it in a component is straightforward with the useAction hook:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function UserList() {</span></span>
<span class="line"><span>  const { execute: loadUsers, loading, error } = useAction(fetchUsers)</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  useEffect(() =&gt; {</span></span>
<span class="line"><span>    loadUsers()</span></span>
<span class="line"><span>  }, [])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;</span></span>
<span class="line"><span>  if (error) return &lt;div&gt;Error: {error}&lt;/div&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  return &lt;UserTable /&gt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="parameterized-actions" tabindex="-1">Parameterized Actions <a class="header-anchor" href="#parameterized-actions" aria-label="Permalink to &quot;Parameterized Actions&quot;">​</a></h2><p>Actions become more powerful when they accept parameters. This lets you create reusable actions that can work with different data or conditions.</p><p>Here&#39;s an action for updating user data:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const updateUser = store.action(</span></span>
<span class="line"><span>  async (store, userId: string, userData: Partial&lt;User&gt;) =&gt; {</span></span>
<span class="line"><span>    store.set(\`users.\${userId}.updating\`, true)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const response = await api.updateUser(userId, userData)</span></span>
<span class="line"><span>      store.batch([</span></span>
<span class="line"><span>        [\`users.\${userId}\`, response.data],</span></span>
<span class="line"><span>        [\`users.\${userId}.updating\`, false]</span></span>
<span class="line"><span>      ])</span></span>
<span class="line"><span>      return response.data</span></span>
<span class="line"><span>    } catch (err) {</span></span>
<span class="line"><span>      store.set(\`users.\${userId}.error\`, err.message)</span></span>
<span class="line"><span>      throw err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>This action shows several advanced patterns:</p><ul><li>Takes multiple parameters (<code>userId</code> and <code>userData</code>)</li><li>Uses path templates for dynamic state updates</li><li>Returns the API response for further processing</li><li>Uses batch updates for atomic state changes</li></ul><h2 id="complex-state-management" tabindex="-1">Complex State Management <a class="header-anchor" href="#complex-state-management" aria-label="Permalink to &quot;Complex State Management&quot;">​</a></h2><p>Actions truly shine when managing complex state changes that involve multiple steps and different parts of your application state.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const checkoutCart = store.action(</span></span>
<span class="line"><span>  async (store) =&gt; {</span></span>
<span class="line"><span>    const cart = store.get(&#39;cart&#39;)</span></span>
<span class="line"><span>    const user = store.get(&#39;user&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    store.batch([</span></span>
<span class="line"><span>      [&#39;checkout.processing&#39;, true],</span></span>
<span class="line"><span>      [&#39;checkout.error&#39;, null]</span></span>
<span class="line"><span>    ])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // Process payment</span></span>
<span class="line"><span>      const paymentResult = await processPayment(cart.total)</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      // Create order</span></span>
<span class="line"><span>      const order = await createOrder({</span></span>
<span class="line"><span>        items: cart.items,</span></span>
<span class="line"><span>        userId: user.id,</span></span>
<span class="line"><span>        paymentId: paymentResult.id</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Update inventory</span></span>
<span class="line"><span>      await updateInventory(cart.items)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Clear cart and update order history</span></span>
<span class="line"><span>      store.batch([</span></span>
<span class="line"><span>        [&#39;cart.items&#39;, []],</span></span>
<span class="line"><span>        [&#39;cart.total&#39;, 0],</span></span>
<span class="line"><span>        [&#39;orders&#39;, [...store.get(&#39;orders&#39;), order]],</span></span>
<span class="line"><span>        [&#39;checkout.processing&#39;, false],</span></span>
<span class="line"><span>        [&#39;checkout.lastOrder&#39;, order.id]</span></span>
<span class="line"><span>      ])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      return order</span></span>
<span class="line"><span>    } catch (err) {</span></span>
<span class="line"><span>      store.batch([</span></span>
<span class="line"><span>        [&#39;checkout.processing&#39;, false],</span></span>
<span class="line"><span>        [&#39;checkout.error&#39;, err.message]</span></span>
<span class="line"><span>      ])</span></span>
<span class="line"><span>      throw err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>)</span></span></code></pre></div>`,23)]))}const g=a(t,[["render",l]]);export{h as __pageData,g as default};
