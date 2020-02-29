<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="css">
.infoText {
  color: grey;
  font-weight: bold;
  font-size: 95%;
  font-stretch: wider;
  margin-top: 1em;
  margin-bottom: 1em;
}
.infoText::before {
  font-family: "Material Icons";
  content: "\e88f";
}
</style>
