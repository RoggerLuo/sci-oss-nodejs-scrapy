/**
 * Created by miffy on 2018/03/13
 */
/**
 * a component for listview
 * using react-virtualized
 * https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md
 * https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md
 * @constructor
 * @param {array} dataSource - the content of listView
 * @param {function} renderRow - the function use to render every row in ur listView.
 * @param {function} loadMore - the function use to load more data
 * @param {number} height - the height of listView
 * @param {bool} loading - judge if fetching data
 */
/*
* TODO
* ① 翻页时 不断发送请求 done
* ② 点击订阅 会返回第一页 应该改回 返回指定页
*/

import React from 'react'
import {autorun} from 'mobx'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import List from 'react-virtualized/dist/commonjs/List'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Nothing from '../components/Nothing'
import 'react-virtualized/styles.css'

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

// @withRouter
// @observer
export default class infiniteList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    }
    this._timeoutIdMap = {}
  }

  updateList = () => {
    this.list.forceUpdateGrid()
  }

  isRowLoaded = (index) => {
    const { loadedRowsMap } = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    const { loadedRowsMap, loadingRowCount } = this.state
    const increment = stopIndex - startIndex + 1
    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING
    }
    this.setState({
      loadingRowCount: loadingRowCount + increment
    })
    const timeoutId = setTimeout(() => {
      const { loadedRowCount, loadingRowCount } = this.state
      delete this._timeoutIdMap[timeoutId]
      for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED
      }
      this.setState({
        loadingRowCount: loadingRowCount - increment,
        loadedRowCount: loadedRowCount + increment
      })
      promiseResolover()
    }, 1000 + Math.round(Math.random() * 2000))
    this._timeoutIdMap[timeoutId] = true
    let promiseResolover
    // this.props.loadMore()
    return new Promise(resolve => {
      promiseResolover = resolve;
    })
  }

  onScroll = (e) => {
    let {clientHeight, scrollHeight, scrollTop} = e,
      balance =  scrollHeight - clientHeight
    if(scrollTop > balance*5/6 && scrollHeight!=0 && !this.props.loading) {
      this.props.loadMore()
    }
  }

  noDataShow = () => {
    //没有数据显示 有可能是没有数据 或者在获取数据 根据this.props.loading判断]
    let {loading, noData} = this.props
    if(loading) {
      return(
        null
      )
    }
    else {
      return(
        noData&&noData()
      )
    }
  }

  render() {
    let { dataSource, height, rowHeight, style, cache, loading } = this.props
    return (
      <div>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          // minimumBatchSize={1}
          // threshold={}
          rowCount={dataSource.length}>
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  onScroll={this.onScroll}
                  ref={(ref) => {
                    this.list = ref
                    return registerChild(ref)
                  }}
                  deferredMeasurementCache={cache}
                  height={height}
                  noRowsRenderer={this.noDataShow}
                  onRowsRendered={onRowsRendered}
                  rowCount={dataSource.length}
                  rowHeight={rowHeight}
                  rowRenderer={this.props.renderRow}
                  width={width}
                  style={style}
                />
              )}
             </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    )
  }
}
