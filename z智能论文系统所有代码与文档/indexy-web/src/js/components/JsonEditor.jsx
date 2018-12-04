import React, { Component } from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'
import './jsonEditor.less'

export default class JsonEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jsonEditorInstance: () => {
      },
      isFullScreen: true,
    }
  }
  
  componentDidUpdate(preProps) {
    if (preProps.values !== this.props.values) {
      this.state.jsonEditorInstance.set(this.props.values)
    }
  }
  
  componentDidMount() {
    let jsonEditor = this.refs.jsoneditor
    let jsonEditorInstance = new JSONEditor(jsonEditor, {
      mode: 'code',
    })
    this.onMount(() => { // 避免在DidMount的时候直接设置state，会导致两次渲染，导致页面thrashing
      this.setState({
        jsonEditorInstance,
      })
      jsonEditorInstance.set(this.props.values)
    })
  }
  // handleFullScreen = () => {
  //   this.setState({
  //     isFullScreen: !this.state.isFullScreen
  //   })
  // }
  onMount = (cb) => {
    cb && cb()
  }
  get = () => {
    try {
      let json = this.state.jsonEditorInstance.get() // jsoneditor校验
      return json
    } catch (e) {
      return false
    }
  }
  set = (json) => {
    this.state.jsonEditorInstance.set(json)
  }
  focus = () => {
    this.state.jsonEditorInstance.focus()
  }
  destroy = () => {
    this.state.jsonEditorInstance.destroy()
  }
  render() {
    let {type} = this.props
    let {isFullScreen} = this.state
    let cls = type === 'textEditor' ? 'code-box text-box' : 'code-box'
    return (
      <div ref="jsoneditor" className={cls}/>
    )
  }
}

{/*<div>*/}
  {/*<div ref="jsoneditor" className={isFullScreen ? `${cls} editor-fullscreen` : cls }>*/}
    {/*<i onClick={this.handleFullScreen} className="icon  iconfont icon-closed editor-expand"/>*/}
  {/*</div>*/}
  {/*占位box*/}
  {/*{*/}
    {/*isFullScreen ? <div className={cls}/> : undefined*/}
  {/*}*/}
{/*</div>*/}
