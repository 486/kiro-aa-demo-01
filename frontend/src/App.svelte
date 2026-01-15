<script>
  import Router from 'svelte-spa-router';
  import { location } from 'svelte-spa-router';
  import Navbar from './components/Navbar.svelte';
  import Toast from './components/Toast.svelte';
  import Home from './pages/Home.svelte';
  import SessionDetail from './pages/SessionDetail.svelte';
  import Schedule from './pages/Schedule.svelte';

  const routes = {
    '/': Home,
    '/session/:id': SessionDetail,
    '/schedule': Schedule,
  };
</script>

<div class="app">
  <Navbar currentPath={$location} />
  <main>
    <Router {routes} />
  </main>
  <Toast />
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }
</style>
