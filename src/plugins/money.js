import Vue from 'vue'

Vue.filter('money', value => {
  return '$' + (value / 100).toFixed(2)
})
