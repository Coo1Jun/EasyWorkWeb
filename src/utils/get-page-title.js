import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Easy Work'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
