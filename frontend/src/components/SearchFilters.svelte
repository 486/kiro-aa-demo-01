<script>
  import { metadata, searchFilters } from '../stores/appStore.js';

  export let onSearch;

  let localFilters = { ...$searchFilters };

  function handleSearch() {
    searchFilters.set({ ...localFilters, page: 1 });
    if (onSearch) onSearch();
  }

  function handleReset() {
    localFilters = {
      session_type: '',
      track: '',
      level: '',
      date: '',
      speaker: '',
      keywords: '',
      page: 1,
      limit: 12
    };
    searchFilters.set(localFilters);
    if (onSearch) onSearch();
  }
</script>

<div class="search-filters">
  <div class="filter-section">
    <h3 class="filter-title">Search & Filter Sessions</h3>
    
    <div class="filter-grid">
      <!-- Keyword Search -->
      <div class="filter-group full-width">
        <label for="keywords">Keywords</label>
        <input
          id="keywords"
          type="text"
          class="input"
          placeholder="Search in title, description, tags..."
          bind:value={localFilters.keywords}
          on:keypress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <!-- Session Type -->
      <div class="filter-group">
        <label for="session_type">Session Type</label>
        <select id="session_type" class="select" bind:value={localFilters.session_type}>
          <option value="">All Types</option>
          {#each $metadata.sessionTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>

      <!-- Track -->
      <div class="filter-group">
        <label for="track">Track</label>
        <select id="track" class="select" bind:value={localFilters.track}>
          <option value="">All Tracks</option>
          {#each $metadata.tracks as track}
            <option value={track}>{track}</option>
          {/each}
        </select>
      </div>

      <!-- Level -->
      <div class="filter-group">
        <label for="level">Level</label>
        <select id="level" class="select" bind:value={localFilters.level}>
          <option value="">All Levels</option>
          {#each $metadata.levels as level}
            <option value={level}>{level}</option>
          {/each}
        </select>
      </div>

      <!-- Date -->
      <div class="filter-group">
        <label for="date">Date</label>
        <input
          id="date"
          type="date"
          class="input"
          bind:value={localFilters.date}
        />
      </div>

      <!-- Speaker -->
      <div class="filter-group">
        <label for="speaker">Speaker Name</label>
        <input
          id="speaker"
          type="text"
          class="input"
          placeholder="Search by speaker..."
          bind:value={localFilters.speaker}
          on:keypress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
    </div>

    <div class="filter-actions">
      <button class="btn btn-primary" on:click={handleSearch}>
        🔍 Search
      </button>
      <button class="btn btn-outline" on:click={handleReset}>
        🔄 Reset Filters
      </button>
    </div>
  </div>
</div>

<style>
  .search-filters {
    background: white;
    border: 1px solid #d5dbdb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .filter-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #232f3e;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group.full-width {
    grid-column: 1 / -1;
  }

  .filter-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #232f3e;
  }

  .filter-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .filter-grid {
      grid-template-columns: 1fr;
    }

    .filter-actions {
      flex-direction: column;
    }

    .filter-actions button {
      width: 100%;
    }
  }
</style>
