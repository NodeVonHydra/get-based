import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    // VitePress prepends /docs/ base to relative paths, so the config
    // uses a placeholder URL. This rewrites it client-side to /app
    // (Vercel routes /app to index.html).
    const fixAppLinks = () => {
      nextTick(() => {
        document.querySelectorAll('a[href*="labcharts.app/app"]').forEach(a => {
          a.href = '/app'
        })
      })
    }
    onMounted(fixAppLinks)
    watch(() => route.path, fixAppLinks)
  }
}
