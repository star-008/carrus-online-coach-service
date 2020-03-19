import Vue from 'vue'

Vue.directive('truncate', {
  inserted: function(el, binding) {
    truncateText(el, binding)
  },
  update: function(el, binding) {
    truncateText(el, binding)
  },
})

function truncateText(el, binding) {
  let text = binding.value ? binding.value : el.innerText
  if (text.length > 150) text = text.substring(0, 150) + '…'
  el.innerHTML = text
}
