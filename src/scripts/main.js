import { initDraggableModals } from './embedModals.js'
import { termCommands, getCommand } from './termCommands.js'
import { toggleNav } from './navToggle.js'
import { preLabels } from './codeBlocks.js'

initDraggableModals();
termCommands()
getCommand()
toggleNav()
preLabels()