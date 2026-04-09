<script>
  import { link } from 'svelte-spa-router';
  import { scheduleAPI } from '../utils/api.js';
  import { userId, userSchedule, toasts } from '../stores/appStore.js';

  export let session;
  export let viewMode = 'card'; // 'card' or 'list'

  $: isInSchedule = $userSchedule.some(s => s.session_id === session.session_id);

  function getLevelColor(level) {
    if (level.includes('100')) return 'badge-success';
    if (level.includes('200')) return 'badge-info';
    if (level.includes('300')) return 'badge-warning';
    if (level.includes('400')) return 'badge-danger';
    return 'badge-secondary';
  }

  function getTypeColor(type) {
    const colors = {
      'Keynote': 'badge-primary',
      'Workshop': 'badge-info',
      'Chalk Talk': 'badge-secondary',
      'Builder Session': 'badge-success',
    };
    return colors[type] || 'badge-secondary';
  }

  async function toggleSchedule() {
    if (!$userId) {
      toasts.show('Please sign in to manage your schedule', 'warning');
      return;
    }

    try {
      if (isInSchedule) {
        const scheduleEntry = $userSchedule.find(s => s.session_id === session.session_id);
        await scheduleAPI.remove(scheduleEntry.schedule_id, $userId);
        userSchedule.remove(scheduleEntry.schedule_id);
        toasts.show('Removed from schedule', 'success');
      } else {
        const response = await scheduleAPI.add($userId, session.session_id);
        if (response.success) {
          userSchedule.add(response.data);
          toasts.show('Added to schedule', 'success');
        }
      }
    } catch (error) {
      toasts.show(error.message || 'Failed to update schedule', 'error');
    }
  }
</script>

{#if viewMode === 'card'}
  <div class="card session-card">
    <div class="session-header">
      <div class="session-badges">
        <span class="badge {getTypeColor(session.session_type)}">{session.session_type}</span>
        <span class="badge {getLevelColor(session.level)}">{session.level}</span>
      </div>
      <button 
        class="bookmark-btn {isInSchedule ? 'bookmarked' : ''}"
        on:click={toggleSchedule}
        title={isInSchedule ? 'Remove from schedule' : 'Add to schedule'}
      >
        {isInSchedule ? '★' : '☆'}
      </button>
    </div>
    
    <h3 class="session-title">
      <a href="/session/{session.session_id}" use:link>
        {session.title}
      </a>
    </h3>
    
    <p class="session-description">{session.description?.substring(0, 150)}...</p>
    
    <div class="session-meta">
      <div class="meta-item">
        <span class="meta-icon">📅</span>
        <span>{new Date(session.date).toLocaleDateString()}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">🕐</span>
        <span>{session.start_time} - {session.end_time}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">📍</span>
        <span>{session.venue} - {session.room}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">🏷️</span>
        <span>{session.track}</span>
      </div>
    </div>
    
    <div class="session-footer">
      <a href="/session/{session.session_id}" use:link class="btn btn-sm btn-outline">
        View Details
      </a>
    </div>
  </div>
{:else}
  <div class="session-list-item">
    <div class="list-main">
      <div class="list-header">
        <h3 class="session-title">
          <a href="/session/{session.session_id}" use:link>
            {session.title}
          </a>
        </h3>
        <button 
          class="bookmark-btn {isInSchedule ? 'bookmarked' : ''}"
          on:click={toggleSchedule}
          title={isInSchedule ? 'Remove from schedule' : 'Add to schedule'}
        >
          {isInSchedule ? '★' : '☆'}
        </button>
      </div>
      
      <div class="session-badges mb-2">
        <span class="badge {getTypeColor(session.session_type)}">{session.session_type}</span>
        <span class="badge {getLevelColor(session.level)}">{session.level}</span>
        <span class="badge badge-secondary">{session.track}</span>
      </div>
      
      <div class="session-meta">
        <div class="meta-item">
          <span class="meta-icon">📅</span>
          <span>{new Date(session.date).toLocaleDateString()}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">🕐</span>
          <span>{session.start_time} - {session.end_time}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">📍</span>
          <span>{session.venue} - {session.room}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .session-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .session-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .session-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .session-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .bookmark-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #d5dbdb;
    transition: color 0.2s;
    padding: 0;
  }

  .bookmark-btn:hover {
    color: #ff9900;
  }

  .bookmark-btn.bookmarked {
    color: #ff9900;
  }

  .session-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .session-title a {
    color: #232f3e;
    text-decoration: none;
  }

  .session-title a:hover {
    color: #ff9900;
  }

  .session-description {
    color: #545b64;
    font-size: 0.875rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
  }

  .session-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #545b64;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .meta-icon {
    font-size: 1rem;
  }

  .session-footer {
    margin-top: auto;
  }

  /* List view styles */
  .session-list-item {
    background: white;
    border: 1px solid #d5dbdb;
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
    transition: box-shadow 0.2s;
  }

  .session-list-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .list-main {
    width: 100%;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .list-header .session-title {
    margin-bottom: 0;
    flex: 1;
  }

  @media (max-width: 768px) {
    .session-meta {
      font-size: 0.75rem;
    }

    .meta-icon {
      font-size: 0.875rem;
    }
  }
</style>
