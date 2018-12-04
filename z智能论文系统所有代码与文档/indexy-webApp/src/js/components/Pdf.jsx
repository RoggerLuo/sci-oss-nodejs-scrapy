/**
 * Created by qingkong on 2018/3/20
 */
import React from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import ActivityIndicator from 'antd-mobile/lib/activity-indicator'
import Button from 'antd-mobile/lib/button'
import Toast from 'antd-mobile/lib/toast'
import InputItem from 'antd-mobile/lib/input-item'
import _ from "lodash"

import Noting from './Nothing'

class PDFWrapper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {width: null}
  }

  componentDidMount () {
    this.setDivSize()
    window.addEventListener("resize", _.throttle(this.setDivSize, 500))
  }

  componentWillUnmount () {
    window.removeEventListener("resize", _.throttle(this.setDivSize, 500))
  }

  setDivSize = () => {
    this.setState({width: this.pdfWrapPDF.getBoundingClientRect().width})
  }

  render() {
    return (
      <div id="row" style={{height: "100vh", width: "100vw", display: "flex"}}>
        {/* <div id="placeholderWrapper" style={{width: "10vw", height: "100vh"}}/> */}
        <div id="pdfWrapper" style={{width: "100vw"}} ref={(ref) => this.pdfWrapPDF = ref}>
          <PdfComponent url={this.props.url} wrapperDivSize={this.state.width} />
        </div>
      </div>
    )
  }
}


 class PdfComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      button: false,
      input: '',
      data: []
    }
  }
  componentDidMount() {
    // let { numPages } = this.state
  }
  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages , button: true });
    let Data = []
    for(var i = 1;i <= numPages;i++){
      Data.push(i)
    }
    this.setState({ data: Data })
  }
  input = (e) => {
    this.setState({ input: parseInt(e) })
  }
  nothing = (text) => {
    return <Noting emptyText={text} />
  }

  render() {
    let { pageNumber, data } = this.state,
    { url } = this.props

    return (
      <div className="PDF">
        <Document
          file={url}
          loading={<ActivityIndicator size="large" toast text="加载中..."/>}
          error={<Noting emptyText="PDF加载出错" />}
          noData={<Noting />}
          onLoadError={(error)=> this.nothing(error.messsage)}
          onLoadSuccess={this.onDocumentLoad}
        >
          {
            data.length && data.map((item,index)=>{
              return <Page pageNumber={item} key={index} width={this.props.wrapperDivSize}  />
            })
          }
        </Document>
      </div>
    )
  }
}

export default PDFWrapper
