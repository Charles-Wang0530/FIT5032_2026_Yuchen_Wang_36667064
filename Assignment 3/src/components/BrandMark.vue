<template>
  <span class="brand-mark" aria-hidden="true">
    <span></span>
    <span></span>
  </span>
</template>

<style scoped>
.brand-mark {
  position: relative;
  display: inline-flex;
  width: 2.25rem;
  height: 1.65rem;
  align-items: flex-end;
  justify-content: center;
  border-bottom: 0.24rem solid currentColor;
  border-radius: 0 0 0.65rem 0.65rem;
}

.brand-mark span {
  position: absolute;
  bottom: 0.2rem;
  width: 1.15rem;
  height: 1.15rem;
  border: 0.2rem solid currentColor;
  border-bottom: 0;
  border-radius: 1rem 1rem 0 0;
}

.brand-mark span:first-child {
  left: 0.08rem;
  transform: rotate(-7deg);
}

.brand-mark span:last-child {
  right: 0.08rem;
  transform: rotate(7deg);
}
</style>

