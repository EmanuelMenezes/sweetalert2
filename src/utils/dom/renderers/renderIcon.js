import privateProps from '../../../privateProps.js'
import { iconTypes, swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'
import { error } from '../../utils.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderIcon = (instance, params) => {
  const innerParams = privateProps.innerParams.get(instance)
  const icon = dom.getIcon()
  if (!icon) {
    return
  }

  // if the given icon already rendered, apply the styling without re-rendering the icon
  if (innerParams && params.icon === innerParams.icon) {
    // Custom or default content
    setContent(icon, params)

    applyStyles(icon, params)
    return
  }

  if (!params.icon && !params.iconHtml) {
    dom.hide(icon)
    return
  }

  if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
    error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`)
    dom.hide(icon)
    return
  }

  dom.show(icon)

  // Custom or default content
  setContent(icon, params)

  applyStyles(icon, params)

  // Animate icon
  dom.addClass(icon, params.showClass && params.showClass.icon)
}

/**
 * @param {HTMLElement} icon
 * @param {SweetAlertOptions} params
 */
const applyStyles = (icon, params) => {
  for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
    if (params.icon !== iconType) {
      dom.removeClass(icon, iconClassName)
    }
  }
  dom.addClass(icon, params.icon && iconTypes[params.icon])

  // Icon color
  setColor(icon, params)

  // Custom class
  dom.applyCustomClass(icon, params, 'icon')
}

/**
 * @param {HTMLElement} icon
 * @param {SweetAlertOptions} params
 */
const setContent = (icon, params) => {
  if (!params.icon && !params.iconHtml) {
    return
  }
  let oldContent = icon.innerHTML
  let newContent = ''
  if (params.iconHtml) {
    newContent = iconContent(params.iconHtml)
  } else if (params.icon) {
    const defaultIconHtml = {
      question:
        '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path fill="#8462b0" d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>',
      warning:
        '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 64 512"><path fill="#f8bb86" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>',
      info: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 64 512"><path fill="#8462b0" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>',
      success:
        '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path fill="#0ba180" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>',
      error:
        '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path fill="#ce2f23" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>',
    }
    newContent = iconContent(defaultIconHtml[params.icon])
  }

  if (oldContent.trim() !== newContent.trim()) {
    dom.setInnerHtml(icon, newContent)
  }
}

/**
 * @param {HTMLElement} icon
 * @param {SweetAlertOptions} params
 */
const setColor = (icon, params) => {
  if (!params.iconColor) {
    return
  }
  icon.style.color = params.iconColor
  icon.style.borderColor = params.iconColor
  for (const sel of [
    '.swal2-success-line-tip',
    '.swal2-success-line-long',
    '.swal2-x-mark-line-left',
    '.swal2-x-mark-line-right',
  ]) {
    dom.setStyle(icon, sel, 'backgroundColor', params.iconColor)
  }
  dom.setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor)
}

/**
 * @param {string} content
 * @returns {string}
 */
const iconContent = (content) => `<div class="${swalClasses['icon-content']}">${content}</div>`
