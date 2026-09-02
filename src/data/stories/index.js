// A case study's long-form body, keyed by the id in the case-study database.
// A study with no entry here has a hero and nothing under it.
import retune from './retune'

export const stories = { retune }

export function getStory(id) {
  return stories[id] || null
}
