<template>
  <div class="settoggle" @click="$emit('set-toggle')">
    <span class="cslittlebutton icon-menu"></span>
  </div>
</template>

<script>
export default {
  name: 'elecV2Toggle'
}
</script>

<style scoped>
.settoggle {
  background: var(--themecl-three);
  color: var(--themecl-one);
  position: absolute;
  top: 422px;
  display: inline-block;
  height: 36px;
  width: 300px;
  margin-left: 10px;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  z-index: 99;
}

.settoggle:hover {  }

.icon-menu::before {
  box-shadow: 0 -.35em, 0 .35em;
  border-top: 2px solid;
  width: 100%;
}
</style>