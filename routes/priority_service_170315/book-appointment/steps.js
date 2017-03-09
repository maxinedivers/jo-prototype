module.exports = {
    '/': {
      backLink: '../intro/what-you-need'
    },
    '/passport-offices': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
    },
    '/book-time': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
    },
    '/book-appointment-2': {
      backLink: '../intro/what-you-need'
    },
    '/book-appointment-3': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
    },
    '/book-appointment-2_mobile': {
      backLink: '../intro/what-you-need'
    },
    '/border-cue-test': {
      backLink: '../intro/what-you-need'
    },
    '/confirmation-scenario-1': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
    },
    '/confirmation-scenario-2': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
    },
    '/responsive': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
    },
    '/london-week-2-selected': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
  },
  '/london-week-1-selected': {
    fields: ['passport-damaged'],
      backLink: './',
      next: '/passport-damaged' /* if No is selected */
},
    '/peterborough-week-1': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
  },
  '/peterborough-week-2': {
    fields: ['passport-damaged'],
      backLink: './',
      next: '/passport-damaged' /* if No is selected */
    },
    '/newport-week-1': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
  },
  '/newport-week-1-selected': {
    fields: ['passport-damaged'],
      backLink: './',
      next: '/passport-damaged' /* if No is selected */
},
    '/london-week-1': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/passport-damaged' /* if No is selected */
  },
  '/london-week-2': {
    fields: ['passport-damaged'],
      backLink: './',
      next: '/passport-damaged' /* if No is selected */
  },
  '/london-week-3': {
    fields: ['passport-damaged'],
      backLink: './',
      next: '/passport-damaged' /* if No is selected */
  },
    '/passport-damaged': {
      fields: ['passport-damaged'],
        backLink: './',
        next: '/uncancelled' /* if No is selected */
    },
    '/uncancelled': {
        controller: require('../../../controllers/go-overseas'),
        fields: ['uncancelled'],
        backLink: './passport-damaged',
        next: '/../intro',
        nextAlt: '../overseas'
    }
};
