<template>
  <div class="w-full min-h-screen inset-0 bg-opacity-75 transition-opacity">
    <div class="min-h-screen grid  justify-items-center content-center">
      <div class="loader"></div>
    </div>
  </div>
</template>

<style>
  .loader {
    border: 7px solid pink; /* Light grey */
    border-top: 7px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>