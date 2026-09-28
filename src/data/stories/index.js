// A case study's long-form body, keyed by the id in the case-study database.
// A study with no entry here has no detail page at all: the route falls through
// and its cards carry no link.
import retune from './retune'
import catatmak from './catatmak'
import emailAction from './emailAction'
import comingSoon from './coming-soon'

export const stories = {
  retune,
  catatmak,
  'email-action': emailAction,
  // Written up to the hero, with the body still to come.
  digiverse: comingSoon,
  jett: comingSoon,
}

export function getStory(id) {
  return stories[id] || null
}
