<script>
  import { link } from 'svelte-spa-router';
  import { userId, userSchedule } from '../stores/appStore.js';

  export let currentPath = '/';
</script>

<nav class="navbar">
  <div class="container nav-content">
    <div class="nav-brand">
      <a href="/" use:link>
        <h1 class="nav-logo">AWS re:Invent</h1>
      </a>
    </div>
    
    <ul class="nav-menu">
      <li class="nav-item">
        <a 
          href="/" 
          use:link
          class="nav-link {currentPath === '/' ? 'active' : ''}"
        >
          Sessions
        </a>
      </li>
      <li class="nav-item">
        <a 
          href="/schedule" 
          use:link
          class="nav-link {currentPath === '/schedule' ? 'active' : ''}"
        >
          My Schedule
          {#if $userSchedule.length > 0}
            <span class="badge badge-primary">{$userSchedule.length}</span>
          {/if}
        </a>
      </li>
    </ul>

    {#if !$userId}
      <div class="nav-actions">
        <button class="btn btn-sm btn-primary" on:click={() => {
          const email = prompt('Enter your email:');
          if (email) userId.set(email);
        }}>
          Sign In
        </button>
      </div>
    {:else}
      <div class="nav-actions">
        <span class="user-email">{$userId}</span>
        <button class="btn btn-sm btn-outline" on:click={() => userId.clear()}>
          Sign Out
        </button>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    background-color: #232f3e;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .nav-brand a {
    text-decoration: none;
    color: white;
  }

  .nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #ff9900;
  }

  .nav-menu {
    display: flex;
    list-style: none;
    gap: 1rem;
    margin: 0;
    padding: 0;
    flex: 1;
  }

  .nav-item {
    margin: 0;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-link.active {
    background-color: rgba(255, 153, 0, 0.2);
    font-weight: 600;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-email {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-menu {
      width: 100%;
      justify-content: center;
    }

    .nav-actions {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    .user-email {
      width: 100%;
      text-align: center;
    }
  }
</style>
