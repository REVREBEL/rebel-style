// stylelint.config.mjs
const SIZES = ['sm', 'md', 'lg', 'xl', 'xxl'];
const SIZE_GROUP = SIZES.join('|'); // "sm|md|lg|xl|xxl"

export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'comment-empty-line-before': null,
    'declaration-block-single-line-max-declarations': null,
    "property-no-vendor-prefix": null,
    'selector-class-pattern': [
      new RegExp(`^[a-z][a-z0-9-]*(?:-(?:${SIZE_GROUP}))?$`),
      {
        resolveNestedSelectors: true,
        message: `Class must be lowercase-hyphen; optional size suffix -(${SIZE_GROUP}).`,
      },
    ],
  },
};
