<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import { scheduleAPI } from '../utils/api.js';
  import { userId, userSchedule, scheduleConflicts, toasts } from '../stores/appStore.js';
  import Loading from '../components/Loading.svelte';
  import Alert from '../components/Alert.svelte';

  let loading = false;
  let error = '';
  let groupedSchedule = {};

  $: if ($userId) {
    loadSchedule();
  }

  onMount(() => {
    if (!$userId) {
      const email = prompt('Please enter your email to view your schedule:');
      if (email) {
        userId.set(email);
      }
    }
  });

  async function loadSchedule() {
    if (!$userId) return;
    
    loading = true;
    error = '';
    
    try {
      const response = await scheduleAPI.get($userId);
      if (response.success) {
        userSchedule.set(response.data.schedule || []);
        groupScheduleByDate();
      }
    } catch (err) {
      error = err.message || 'Failed to load schedule';
      toasts.show(error, 'error');
    } finally {
      loading = false;
    }
  }

  function groupScheduleByDate() {
    groupedSchedule = $userSchedule.reduce((acc, session) => {
      const date = session.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {});

    // Sort sessions within each date by start time
    Object.keys(groupedSchedule).forEach(date => {
      groupedSchedule[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
  }

  async function removeFromSchedule(scheduleId) {
    if (!confirm('Are you sure you want to remove this session from your schedule?')) {
      return;
    }

    try {
      await scheduleAPI.remove(scheduleId, $userId);
      userSchedule.remove(scheduleId);
      groupScheduleByDate();
      toasts.show('Removed from schedule', 'success');
    } catch (err) {
      toasts.show(err.message || 'Failed to remove session', 'error');
    }
  }

  function hasConflict(sessionId) {
    return $scheduleConflicts.some(
      c => c.session1 === sessionId || c.session2 === sessionId
    );
  }

  function getConflictInfo(sessionId) {
    return $scheduleConflicts.find(
      c => c.session1 === sessionId || c.session2 === sessionId
    );
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  $: totalSessions = $userSchedule.length;
  $: totalDuration = $userSchedule.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  $: sortedDates = Object.keys(groupedSchedule).sort();
</script>

<div class="page">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">My Schedule</h1>
      {#if $userId}
        <p class="page-subtitle">Personal schedule for {$userId}</p>
      {/if}
    </div>

    {#if !$userId}
      <div class="empty-state">
        <p class="text-lg">Please sign in to view your schedule</p>
        <button class="btn btn-primary mt-4" on:click={() => {
          const email = prompt('Enter your email:');
          if (email) userId.set(email);
        }}>
          Sign In
        </button>
      </div>
    {:else}
      {#if error}
        <Alert message={error} type="error" />
      {/if}

      <Loading show={loading} />

      {#if !loading}
        {#if $scheduleConflicts.length > 0}
          <div class="conflicts-alert">
            <h3>⚠️ Schedule Conflicts Detected</h3>
            <p>You have {$scheduleConflicts.length} scheduling conflict{$scheduleConflicts.length > 1 ? 's' : ''}:</p>
            <ul>
              {#each $scheduleConflicts as conflict}
                <li>
                  Sessions <strong>{conflict.session1}</strong> and <strong>{conflict.session2}</strong> 
                  overlap on {formatDate(conflict.date)} at {conflict.time}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if totalSessions > 0}
          <div class="schedule-summary">
            <div class="summary-card">
              <div class="summary-icon">📅</div>
              <div class="summary-info">
                <div class="summary-value">{totalSessions}</div>
                <div class="summary-label">Total Sessions</div>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon">🕐</div>
              <div class="summary-info">
                <div class="summary-value">{Math.round(totalDuration / 60)} hrs</div>
                <div class="summary-label">Total Time</div>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon">📆</div>
              <div class="summary-info">
                <div class="summary-value">{sortedDates.length}</div>
                <div class="summary-label">Days</div>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon">⚠️</div>
              <div class="summary-info">
                <div class="summary-value">{$scheduleConflicts.length}</div>
                <div class="summary-label">Conflicts</div>
              </div>
            </div>
          </div>

          <div class="schedule-content">
            {#each sortedDates as date}
              <div class="day-section">
                <h2 class="day-header">
                  {formatDate(date)}
                  <span class="session-count">
                    {groupedSchedule[date].length} session{groupedSchedule[date].length > 1 ? 's' : ''}
                  </span>
                </h2>

                <div class="timeline">
                  {#each groupedSchedule[date] as session}
                    <div class="timeline-item {hasConflict(session.session_id) ? 'has-conflict' : ''}">
                      <div class="timeline-marker">
                        <div class="timeline-time">{session.start_time}</div>
                      </div>
                      
                      <div class="session-card">
                        {#if hasConflict(session.session_id)}
                          <div class="conflict-badge">
                            ⚠️ Conflict
                          </div>
                        {/if}

                        <div class="session-content">
                          <h3 class="session-title">
                            <a href="/session/{session.session_id}" use:link>
                              {session.title}
                            </a>
                          </h3>

                          <div class="session-meta">
                            <span class="badge badge-primary">{session.session_type}</span>
                            <span class="badge badge-secondary">{session.track}</span>
                            <span class="badge badge-info">{session.level}</span>
                          </div>

                          <div class="session-details">
                            <div class="detail-item">
                              <span class="icon">🕐</span>
                              <span>{session.start_time} - {session.end_time} ({session.duration_minutes} min)</span>
                            </div>
                            <div class="detail-item">
                              <span class="icon">📍</span>
                              <span>{session.venue} - {session.room}</span>
                            </div>
                          </div>

                          {#if session.notes}
                            <div class="session-notes">
                              <strong>Your notes:</strong>
                              <p>{session.notes}</p>
                            </div>
                          {/if}

                          <div class="session-actions">
                            <a href="/session/{session.session_id}" use:link class="btn btn-sm btn-outline">
                              View Details
                            </a>
                            <button 
                              class="btn btn-sm btn-danger" 
                              on:click={() => removeFromSchedule(session.schedule_id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>

          <div class="schedule-actions">
            <a href="/" use:link class="btn btn-primary">
              Browse More Sessions
            </a>
          </div>
        {:else}
          <div class="empty-state">
            <p class="text-lg">Your schedule is empty</p>
            <p class="text-sm mb-4">Start adding sessions to build your personalized conference schedule</p>
            <a href="/" use:link class="btn btn-primary">
              Browse Sessions
            </a>
          </div>
        {/if}
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

  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: #545b64;
  }

  .conflicts-alert {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .conflicts-alert h3 {
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
  }

  .conflicts-alert ul {
    margin: 1rem 0 0 1.5rem;
  }

  .conflicts-alert li {
    margin-bottom: 0.5rem;
  }

  .schedule-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .summary-card {
    background: white;
    border: 1px solid #d5dbdb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .summary-icon {
    font-size: 2.5rem;
  }

  .summary-info {
    flex: 1;
  }

  .summary-value {
    font-size: 1.875rem;
    font-weight: 700;
    color: #232f3e;
  }

  .summary-label {
    font-size: 0.875rem;
    color: #545b64;
  }

  .schedule-content {
    margin-bottom: 2rem;
  }

  .day-section {
    margin-bottom: 3rem;
  }

  .day-header {
    font-size: 1.5rem;
    font-weight: 700;
    color: #232f3e;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #ff9900;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .session-count {
    font-size: 0.875rem;
    font-weight: 500;
    color: #545b64;
  }

  .timeline {
    position: relative;
    padding-left: 120px;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 100px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #d5dbdb;
  }

  .timeline-item {
    position: relative;
    margin-bottom: 2rem;
  }

  .timeline-marker {
    position: absolute;
    left: -120px;
    width: 100px;
    text-align: right;
  }

  .timeline-marker::after {
    content: '';
    position: absolute;
    right: -22px;
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ff9900;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #ff9900;
  }

  .timeline-time {
    font-size: 0.875rem;
    font-weight: 600;
    color: #232f3e;
  }

  .session-card {
    background: white;
    border: 1px solid #d5dbdb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    position: relative;
  }

  .timeline-item.has-conflict .session-card {
    border-color: #ffc107;
    background-color: #fff9e6;
  }

  .conflict-badge {
    position: absolute;
    top: -12px;
    right: 1rem;
    background-color: #ffc107;
    color: #856404;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .session-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .session-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .session-title a {
    color: #232f3e;
    text-decoration: none;
  }

  .session-title a:hover {
    color: #ff9900;
  }

  .session-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .session-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #545b64;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    font-size: 1rem;
  }

  .session-notes {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .session-notes strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #232f3e;
  }

  .session-notes p {
    color: #545b64;
    margin: 0;
  }

  .session-actions {
    display: flex;
    gap: 0.75rem;
  }

  .schedule-actions {
    text-align: center;
    padding-top: 2rem;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 1.875rem;
    }

    .timeline {
      padding-left: 0;
    }

    .timeline::before {
      display: none;
    }

    .timeline-marker {
      position: static;
      width: auto;
      text-align: left;
      margin-bottom: 0.5rem;
    }

    .timeline-marker::after {
      display: none;
    }

    .session-actions {
      flex-direction: column;
    }

    .schedule-summary {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
