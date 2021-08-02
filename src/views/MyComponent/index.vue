<template>
  <div>
    {{ count }}
    <button @click="++count">++++</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  name: "MyComponent",
};
</script>

<style>
</style>
