cd %cd%

type ..\src\dwz.util.js > dwz.js
type ..\src\dwz.util.string.js >> dwz.js
type ..\src\dwz.util.date.js >> dwz.js
type ..\src\dwz.util.number.js >> dwz.js

type ..\src\dwz.core.js >> dwz.js
type ..\src\dwz.validate.method.js >> dwz.js
type ..\src\dwz.barDrag.js >> dwz.js
type ..\src\dwz.drag.js >> dwz.js
type ..\src\dwz.tree.js >> dwz.js
type ..\src\dwz.accordion.js >> dwz.js
type ..\src\dwz.ui.js >> dwz.js
type ..\src\dwz.theme.js >> dwz.js
type ..\src\dwz.switchEnv.js >> dwz.js

type ..\src\dwz.alertMsg.js >> dwz.js
type ..\src\dwz.contextmenu.js >> dwz.js
type ..\src\dwz.navTab.js >> dwz.js
type ..\src\dwz.tab.js >> dwz.js
type ..\src\dwz.resize.js >> dwz.js
type ..\src\dwz.dialog.js >> dwz.js
type ..\src\dwz.dialogDrag.js >> dwz.js
type ..\src\dwz.sortDrag.js >> dwz.js
type ..\src\dwz.cssTable.js >> dwz.js
type ..\src\dwz.stable.js >> dwz.js
type ..\src\dwz.taskBar.js >> dwz.js
type ..\src\dwz.ajax.js >> dwz.js
type ..\src\dwz.pagination.js >> dwz.js
type ..\src\dwz.lookup.js >> dwz.js
type ..\src\dwz.suggest.js >> dwz.js
type ..\src\dwz.masterSlave.js >> dwz.js
type ..\src\dwz.datepicker.js >> dwz.js
type ..\src\dwz.effects.js >> dwz.js
type ..\src\dwz.panel.js >> dwz.js
type ..\src\dwz.checkbox.js >> dwz.js
type ..\src\dwz.combox.js >> dwz.js
type ..\src\dwz.history.js >> dwz.js
type ..\src\dwz.print.js >> dwz.js
type ..\src\dwz.uploadifive.js >> dwz.js
type ..\src\dwz.regional.zh.js >> dwz.js

uglifyjs dwz.js -o dwz.min.js -c -m