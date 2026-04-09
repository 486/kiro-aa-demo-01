<script>
  import { onMount } from 'svelte';
  import { sessionsAPI, metadataAPI } from '../utils/api.js';
  import { metadata, searchFilters, toasts } from '../stores/appStore.js';
  import Loading from '../components/Loading.svelte';
  import Alert from '../components/Alert.svelte';
  import SessionCard from '../components/SessionCard.svelte';
  import SearchFilters from '../components/SearchFilters.svelte';

  let sessions = [];
  let totalSessions = 0;
  let totalPages = 1;
  let currentPage = 1;
  let loading = false;
  let error = '';
  let viewMode = 'card'; // 'card' or 'list'

  onMount(async () => {
    await loadMetadata();
    await loadSessions();
  });

  async function loadMetadata() {
    try {
      const response = await metadataAPI.get();
      if (response.success) {
        metadata.set(response.data);
      }
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  }

  async function loadSessions() {
    loading = true;
    error = '';
    
    try {
      const filters = { ...$searchFilters, page: currentPage };
      
      // Check if any filters are applied
      const hasFilters = filters.session_type || filters.track || filters.level || 
                         filters.date || filters.speaker || filters.keywords;
      
      let response;
      if (hasFilters) {
        response = await sessionsAPI.search(filters);
      } else {
        response = await sessionsAPI.getAll(currentPage, filters.limit);
      }

      if (response.success) {
        sessions = response.data.sessions || [];
        totalSessions = response.data.total || 0;
        totalPages = response.data.totalPages || 1;
        currentPage = response.data.page || 1;
      }
    } catch (err) {
      error = err.message || 'Failed to load sessions';
      toasts.show(error, 'error');
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadSessions();
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      loadSessions();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function toggleViewMode() {
    viewMode = viewMode === 'card' ? 'list' : 'card';
  }
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">AWS re:Invent Sessions</h1>
      <p class="page-subtitle">Browse and discover sessions from AWS re:Invent conference</p>
    </div>

    <SearchFilters onSearch={handleSearch} />

    <div class="results-header">
      <div class="results-info">
        <p class="text-sm">
          Showing <strong>{sessions.length}</strong> of <strong>{totalSessions}</strong> sessions
        </p>
      </div>
      <div class="view-toggle">
        <button 
          class="btn btn-sm {viewMode === 'card' ? 'btn-primary' : 'btn-outline'}"
          on:click={toggleViewMode}
        >
          {viewMode === 'card' ? '📇 Card View' : '📋 List View'}
        </button>
      </div>
    </div>

    {#if error}
      <Alert message={error} type="error" />
    {/if}

    <Loading show={loading} />

    {#if !loading && sessions.length === 0}
      <div class="empty-state">
        <p class="text-lg">No sessions found</p>
        <p class="text-sm">Try adjusting your filters or search criteria</p>
      </div>
    {/if}

    {#if !loading && sessions.length > 0}
      {#if viewMode === 'card'}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {#each sessions as session (session.session_id)}
            <SessionCard {session} {viewMode} />
          {/each}
        </div>
      {:else}
        <div class="sessions-list">
          {#each sessions as session (session.session_id)}
            <SessionCard {session} {viewMode} />
          {/each}
        </div>
      {/if}

      {#if totalPages > 1}
        <div class="pagination">
          <button 
            class="btn btn-outline" 
            disabled={currentPage === 1}
            on:click={() => goToPage(currentPage - 1)}
          >
            ← Previous
          </button>
          
          <div class="page-numbers">
            {#each Array(Math.min(totalPages, 7)) as _, i}
              {@const pageNum = i + 1}
              {#if totalPages <= 7 || pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)}
                <button
                  class="btn btn-sm {currentPage === pageNum ? 'btn-primary' : 'btn-outline'}"
                  on:click={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              {:else if pageNum === 2 || pageNum === totalPages - 1}
                <span class="pagination-ellipsis">...</span>
              {/if}
            {/each}
          </div>

          <button 
            class="btn btn-outline" 
            disabled={currentPage === totalPages}
            on:click={() => goToPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .page {
    padding: 2rem 0;
    min-height: calc(100vh - 80px);
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #232f3e;
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    font-size: 1.125rem;
    color: #545b64;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .results-info {
    color: #545b64;
  }

  .view-toggle {
    display: flex;
    gap: 0.5rem;
  }

  .sessions-list {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: #545b64;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3rem;
    flex-wrap: wrap;
  }

  .page-numbers {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-ellipsis {
    padding: 0.375rem 0.5rem;
    color: #545b64;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 1.875rem;
    }

    .page-subtitle {
      font-size: 1rem;
    }

    .results-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .view-toggle {
      width: 100%;
    }

    .view-toggle button {
      flex: 1;
    }
  }
</style>
