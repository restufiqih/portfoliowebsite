// Path routing without a router dependency. The navbar already speaks in hrefs,
// so a route is just an href that starts with '/'.
//
// `pushState` does not fire `popstate` -- that event is only for the back and
// forward buttons -- so navigating in-app announces itself and the listener
// watches for both.
export const ROUTE_CHANGE = 'routechange'

export function currentPath() {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname
}

export function navigate(path) {
  if (window.location.pathname === path) return
  window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(ROUTE_CHANGE))
}
