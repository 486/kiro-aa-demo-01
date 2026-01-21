<script>
  import { toasts } from '../stores/appStore.js';

  function getToastClass(type) {
    switch (type) {
      case 'success': return 'toast-success';
      case 'error': return 'toast-error';
      case 'warning': return 'toast-warning';
      default: return 'toast-info';
    }
  }
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div class="toast {getToastClass(toast.type)}" on:click={() => toasts.remove(toast.id)}>
      <p>{toast.message}</p>
      <button class="toast-close" on:click={() => toasts.remove(toast.id)}>×</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
  }

  .toast {
    padding: 1rem 2.5rem 1rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
    position: relative;
    cursor: pointer;
  }

  .toast p {
    margin: 0;
    font-size: 0.875rem;
  }

  .toast-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
  }

  .toast-close:hover {
    opacity: 1;
  }

  .toast-success {
    background-color: #037f0c;
    color: white;
  }

  .toast-error {
    background-color: #d13212;
    color: white;
  }

  .toast-warning {
    background-color: #ffc107;
    color: #232f3e;
  }

  .toast-info {
    background-color: #0073bb;
    color: white;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    .toast-container {
      left: 1rem;
      right: 1rem;
      max-width: none;
    }
  }
</style>
