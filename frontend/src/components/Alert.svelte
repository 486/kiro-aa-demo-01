<script>
  export let message = '';
  export let type = 'error';
</script>

<div class="{type === 'error' ? 'error' : 'success'}">
  <p>{message}</p>
</div>

<style>
  div {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
