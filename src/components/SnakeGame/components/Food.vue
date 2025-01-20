<script setup lang="ts">
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});

const getFoodStyle = computed(() => {
  const size = getComputedStyle(document.documentElement)
    .getPropertyValue('--grid-size')
    .trim()
    .replace('px', '');
    
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${props.position.x * parseInt(size)}px`,
    top: `${props.position.y * parseInt(size)}px`,
  };
});
</script>
