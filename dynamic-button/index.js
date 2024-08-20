import { state } from 'public/button-state'
import { autorun } from 'mobx'

$w.onReady(() => {
  const today = new Date()
  autorun(() => {
    $w('#btnMain').label = state.label || 'Click Me'
    $w('#btnMain').link = state.href
  })
})

$widget.onPropsChanged((oldProps, newProps) => {
  const { startDate, endDate, label, href } = newProps
})
