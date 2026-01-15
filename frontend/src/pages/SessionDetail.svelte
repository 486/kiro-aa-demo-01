<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import { sessionsAPI, scheduleAPI } from '../utils/api.js';
  import { userId, userSchedule, toasts } from '../stores/appStore.js';
  import Loading from '../components/Loading.svelte';
  import Alert from '../components/Alert.svelte';

  export let params = {};
  
  let session = null;
  let loading = false;
  let error = '';
  let addingNote = false;
  let noteText = '';

  $: isInSchedule = $userSchedule.some(s => s.session_id === params.id);
  $: scheduleEntry = $userSchedule.find(s => s.session_id === params.id);

  onMount(async () => {
    await loadSession();
  });

  async function loadSession() {
    loading = true;
    error = '';
    
    try {
      const response = await sessionsAPI.getById(params.id);
      if (response.success) {
        session = response.data;
      }
    } catch (err) {
      error = err.message || 'Failed to load session';
      toasts.show(error, 'error');
    } finally {
      loading = false;
    }
  }

  async function toggleSchedule() {
    if (!$userId) {
      toasts.show('Please sign in to manage your schedule', 'warning');
      return;
    }

    try {
      if (isInSchedule) {
        await scheduleAPI.remove(scheduleEntry.schedule_id, $userId);
        userSchedule.remove(scheduleEntry.schedule_id);
        toasts.show('Removed from schedule', 'success');
      } else {
        const response = await scheduleAPI.add($userId, session.session_id, noteText);
        if (response.success) {
          userSchedule.add(response.data);
          toasts.show('Added to schedule', 'success');
          noteText = '';
          addingNote = false;
        }
      }
    } catch (err) {
      toasts.show(err.message || 'Failed to update schedule', 'error');
    }
  }

  function getLevelColor(level) {
    if (!level) return 'badge-secondary';
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
</script>

<div class="page">
  <div class="container">
    <div class="breadcrumb">
      <a href="/" use:link>← Back to Sessions</a>
    </div>

    {#if error}
      <Alert message={error} type="error" />
    {/if}

    <Loading show={loading} />

    {#if !loading && session}
      <div class="session-detail">
        <div class="session-main">
          <div class="session-header-badges">
            <span class="badge {getTypeColor(session.session_type)}">{session.session_type}</span>
            <span class="badge {getLevelColor(session.level)}">{session.level}</span>
            <span class="badge badge-secondary">{session.track}</span>
          </div>

          <h1 class="session-title">{session.title}</h1>
          
          <div class="session-meta-bar">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🕐</span>
              <span>{session.start_time} - {session.end_time}</span>
              <span class="text-sm">({session.duration_minutes} min)</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span>{session.venue} - {session.room}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">👥</span>
              <span>Capacity: {session.capacity}</span>
            </div>
          </div>

          <div class="session-description">
            <h2>Description</h2>
            <p>{session.description}</p>
          </div>

          {#if session.tags}
            <div class="session-tags">
              <h3>Tags</h3>
              <div class="tags-list">
                {#each session.tags.split(',') as tag}
                  <span class="badge badge-secondary">{tag.trim()}</span>
                {/each}
              </div>
            </div>
          {/if}

          {#if session.speakers && session.speakers.length > 0}
            <div class="session-speakers">
              <h2>Speakers</h2>
              <div class="speakers-grid">
                {#each session.speakers as speaker}
                  <div class="speaker-card">
                    {#if speaker.photo_url}
                      <img src={speaker.photo_url} alt={speaker.name} class="speaker-photo" />
                    {:else}
                      <div class="speaker-photo-placeholder">
                        {speaker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    {/if}
                    <div class="speaker-info">
                      <h3>{speaker.name}</h3>
                      <p class="speaker-title">{speaker.title}</p>
                      <p class="speaker-company">{speaker.company}</p>
                      {#if speaker.bio}
                        <p class="speaker-bio">{speaker.bio}</p>
                      {/if}
                      <div class="speaker-links">
                        {#if speaker.linkedin_url}
                          <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        {/if}
                        {#if speaker.twitter_handle}
                          <a href="https://twitter.com/{speaker.twitter_handle.replace('@', '')}" target="_blank" rel="noopener noreferrer">
                            Twitter
                          </a>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="session-sidebar">
          <div class="card">
            <h3 class="mb-4">Add to Schedule</h3>
            
            {#if !isInSchedule}
              {#if !addingNote}
                <button class="btn btn-primary full-width mb-2" on:click={toggleSchedule}>
                  ⭐ Add to My Schedule
                </button>
                <button class="btn btn-outline full-width" on:click={() => addingNote = true}>
                  📝 Add with Note
                </button>
              {:else}
                <div class="note-form">
                  <label for="note">Personal Note</label>
                  <textarea
                    id="note"
                    class="input"
                    rows="3"
                    placeholder="Add a personal note..."
                    bind:value={noteText}
                  ></textarea>
                  <div class="note-actions">
                    <button class="btn btn-primary" on:click={toggleSchedule}>
                      Add to Schedule
                    </button>
                    <button class="btn btn-outline" on:click={() => { addingNote = false; noteText = ''; }}>
                      Cancel
                    </button>
                  </div>
                </div>
              {/if}
            {:else}
              <div class="schedule-status">
                <p class="success-message">✓ In your schedule</p>
                {#if scheduleEntry?.notes}
                  <div class="note-display">
                    <strong>Your note:</strong>
                    <p>{scheduleEntry.notes}</p>
                  </div>
                {/if}
                <button class="btn btn-danger full-width mt-3" on:click={toggleSchedule}>
                  Remove from Schedule
                </button>
              </div>
            {/if}
          </div>

          <div class="card mt-4">
            <h3 class="mb-3">Session Info</h3>
            <dl class="info-list">
              <dt>Session ID</dt>
              <dd>{session.session_id}</dd>
              
              <dt>Type</dt>
              <dd>{session.session_type}</dd>
              
              <dt>Track</dt>
              <dd>{session.track}</dd>
              
              <dt>Level</dt>
              <dd>{session.level}</dd>
              
              <dt>Duration</dt>
              <dd>{session.duration_minutes} minutes</dd>
              
              <dt>Venue</dt>
              <dd>{session.venue}</dd>
              
              <dt>Room</dt>
              <dd>{session.room}</dd>
            </dl>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    padding: 2rem 0;
    min-height: calc(100vh - 80px);
  }

  .breadcrumb {
    margin-bottom: 2rem;
  }

  .breadcrumb a {
    color: #0073bb;
    text-decoration: none;
    font-size: 0.875rem;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .session-detail {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }

  .session-main {
    min-width: 0;
  }

  .session-header-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .session-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #232f3e;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .session-meta-bar {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #545b64;
  }

  .meta-icon {
    font-size: 1.125rem;
  }

  .session-description {
    margin-bottom: 2rem;
  }

  .session-description h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #232f3e;
  }

  .session-description p {
    line-height: 1.8;
    color: #545b64;
  }

  .session-tags {
    margin-bottom: 2rem;
  }

  .session-tags h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #232f3e;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .session-speakers {
    margin-bottom: 2rem;
  }

  .session-speakers h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #232f3e;
  }

  .speakers-grid {
    display: grid;
    gap: 1.5rem;
  }

  .speaker-card {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
  }

  .speaker-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  .speaker-photo-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #ff9900;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
  }

  .speaker-info {
    flex: 1;
  }

  .speaker-info h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #232f3e;
  }

  .speaker-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #545b64;
    margin-bottom: 0.25rem;
  }

  .speaker-company {
    font-size: 0.875rem;
    color: #ff9900;
    margin-bottom: 0.75rem;
  }

  .speaker-bio {
    font-size: 0.875rem;
    line-height: 1.6;
    color: #545b64;
    margin-bottom: 0.75rem;
  }

  .speaker-links {
    display: flex;
    gap: 1rem;
  }

  .speaker-links a {
    font-size: 0.875rem;
    color: #0073bb;
    text-decoration: none;
  }

  .speaker-links a:hover {
    text-decoration: underline;
  }

  .session-sidebar {
    position: sticky;
    top: 100px;
    height: fit-content;
  }

  .full-width {
    width: 100%;
  }

  .note-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .note-form label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #232f3e;
  }

  .note-form textarea {
    resize: vertical;
  }

  .note-actions {
    display: flex;
    gap: 0.5rem;
  }

  .note-actions button {
    flex: 1;
  }

  .schedule-status {
    text-align: center;
  }

  .success-message {
    color: #037f0c;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .note-display {
    text-align: left;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .note-display strong {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .note-display p {
    font-size: 0.875rem;
    color: #545b64;
    margin: 0;
  }

  .info-list {
    display: grid;
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .info-list dt {
    font-weight: 600;
    color: #232f3e;
  }

  .info-list dd {
    color: #545b64;
    margin: 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e7eef1;
  }

  .info-list dd:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 1024px) {
    .session-detail {
      grid-template-columns: 1fr;
    }

    .session-sidebar {
      position: static;
    }

    .speaker-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  @media (max-width: 768px) {
    .session-title {
      font-size: 1.875rem;
    }

    .note-actions {
      flex-direction: column;
    }
  }
</style>
