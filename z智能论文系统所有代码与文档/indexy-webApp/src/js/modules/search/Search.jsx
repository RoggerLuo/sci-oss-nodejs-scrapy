/**
 * Created by qingkong on 2018/1/18
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import SearchBar from 'antd-mobile/lib/search-bar'
import List from 'antd-mobile/lib/list'
import ActivityIndicator from 'antd-mobile/lib/activity-indicator'
import Icon from 'antd-mobile/lib/icon'
import ContentListItem from '../../components/content-list-item/ContentListItem'
import path from '../../app/path'
import './search.less'
const Item = List.Item

@withRouter
@inject("search")
@observer
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
      placeholder: '搜索',
      search: '',
      status: false,
      searchType: '全部',
      moreArt: false,
      moreAuthors: false,
      morePer: false,
    };
  }
  componentDidMount() {
    this.autoFocusInst.focus();
  }
  searchChange = (e) => {
    this.reset()
    this.setState({ status: false })
    if (!e) {
      this.setState({ search: e, status: false })
    }
  }
  showSearchBar = () => {
    this.props.history.goBack()
    this.reset()
  }
  placeholderChange = (type) => {
    let data = '搜索' + type
    this.setState({
      placeholder: data,
      searchType: type
    })
    // this.autoFocusInst.focus();
    // this.timer = setTimeout(()=>this.autoFocusInst.focus(),1000)
  }
  onFocus = () => {
    if (!this.state.search) {
      this.setState({ status: false })
    }
  }
  submitSearch = (val) => {
    //点击键盘的enter
    this.setState({ search: val, status: true })
    let { searchType } = this.state
    // if (this.state.searchType === '全部') {
    //   this.props.search.searchArticals(val)
    //   this.props.search.searchAuthors(val)
    //   this.props.search.searchPeriodicals(val)
    // }
    switch (searchType) {
      case '论文':
        this.props.search.searchArticals(val,10)
        break;
      case '期刊':
        this.props.search.searchPeriodicals(val,10)
        break;
      case '作者':
        this.props.search.searchAuthors(val,10)
        break;
      case '全部':
        this.props.search.searchArticals(val,3)
        this.props.search.searchPeriodicals(val,3)
        this.props.search.searchAuthors(val,3)
    }
  }
  articles = () => {
    this.setState({ searchType: '论文', moreArt: true })
    let { search } = this.state
    this.props.search.searchArticals(search,100)
    // this.props.history.push(`/result/${id}`)
  }
  authors = () => {
    this.setState({ searchType: '作者', moreAuthors: true })
    let { search } = this.state
    this.props.search.searchAuthors(search,100)
  }
  periodicals = () => {
    this.setState({ searchType: '期刊', morePer: true })
    let { search } = this.state
    this.props.search.searchPeriodicals(search,100)
  }
  goDetail = (id) => {
    //论文详情
    this.props.history.push(`/details/${id}`)
  }
  searchArt = (type, value) => {
    //搜索文章结果
    let { articles, articlesLoading } = this.props.search,
      { searchType, moreArt } = this.state
    return (
      <div>
        {
          searchType === '全部' && articles.length == 0 || searchType === '论文' && articles.length == 0 ?
            null :
            <List
              renderHeader={() => '论文'}
              className="my-list articles"
              renderFooter={() => (moreArt?null:<div onClick={this.articles}><i className="iconfont icon-sousuo"/>
                点击查看更多论文<i className="iconfont icon-xiangxia-copy-copy"/></div>)}
            >
              {
                articles.map((item, i) => {
                  return (
                    <Item key={i} onClick={this.goDetail.bind(this,item.id)}>{item.title}</Item>
                  )
                })
              }
            </List>
        }
      </div>
    )
  }
  searchAuthors = () => {
    let { authors, authorsLoading } = this.props.search,
      { searchType, moreAuthors } = this.state
    return (
      <div>
        {
          searchType === '全部' && authors.length == 0 || searchType === '作者' && authors.length == 0 ?
            null :
            <List
              renderHeader={() => '作者'}
              className="my-list author"
              renderFooter={() => (moreAuthors?null:<div onClick={this.authors}><i className="iconfont icon-sousuo"/>
                点击查看更多作者<i className="iconfont icon-xiangxia-copy-copy"/></div>)}
            >
              {
                authors.map((item, i) => {
                  return (
                    <Item key={item.id}>
                      <ContentListItem item={item} type="searchAuthors"/>
                    </Item>
                  )
                })
              }
            </List>
        }
      </div>
    )
  }
  searchPer = () => {
    //搜索期刊结果
    let { periodicals, periodicalsLoading } = this.props.search,
      { searchType, morePer } = this.state
    return (
      <div>
        {
          searchType === '全部' && periodicals.length == 0 || searchType === '期刊' && periodicals.length == 0 ?
            null :
            <List
              renderHeader={() => '期刊'}
              className="my-list periodicals"
              renderFooter={() => (morePer ? null : <div onClick={this.periodicals}><i className="iconfont icon-sousuo"/>
                点击查看更多期刊<i className="iconfont icon-xiangxia-copy-copy"/></div>)}
            >
              {
                periodicals.map((item, i) => {
                  return (
                    <Item key={item.journal.id}>
                      <ContentListItem item={item} type="searchPeriodicals"/>
                    </Item>
                  )
                })
              }
            </List>
        }
      </div>
    )
  }
  noData = () => {
    return (
      <div className="key-word">
        <div className="title">
          未搜索到相关信息
        </div>
      </div>
    )
  }
  reset = () => {
    this.props.search.reset()
  }
  render() {
    let { placeholder, search, status, searchType } = this.state,
      { articles, authors, periodicals, articlesLoading, authorsLoading, periodicalsLoading } = this.props.search,
      showNoData = false
    if (authors.length === 0 && articles.length === 0 && periodicals.length === 0) {
      showNoData = true
    }
    if (
      searchType === '论文' && articles.length === 0 ||
      searchType === '作者' && authors.length === 0 ||
      searchType === '期刊' && periodicals.length === 0
    ) {
      showNoData = true
    }
    let catalog = [
      {name: '论文', className: ''},
      {name: '作者', className: 'center'},
      {name: '期刊', className: ''},
    ]
    return (
      <div className="search">
        <div className="searchbar-container">
          <SearchBar
            clear
            ref={ref => this.autoFocusInst = ref}
            placeholder={placeholder}
            maxLength={20}
            onCancel={this.showSearchBar}
            onSubmit={this.submitSearch}
            onChange={this.searchChange}
            onFocus={this.onFocus}
          />
        </div>
        {
          status ?
            <div className="search-content">
              {
                searchType === '全部' ?
                  <div>
                    {
                      articlesLoading || authorsLoading || periodicalsLoading ?
                        <div className="loading">
                          <ActivityIndicator text="Loading..."/>
                        </div>
                        :
                        <div>
                          {
                            showNoData ?
                              <div>{this.noData()}</div>
                              :
                              <div>
                                {this.searchArt()}
                                {this.searchAuthors()}
                                {this.searchPer()}
                              </div>
                          }
                        </div>
                    }
                  </div>
                  : null
              }
              {
                searchType === '论文' ?
                  <div>
                    {
                      articlesLoading ?
                        <div className="loading">
                          <ActivityIndicator text="Loading..."/>
                        </div>
                        :
                        <div>
                          {
                            showNoData ?
                              <div>{this.noData()}</div> : <div>{this.searchArt()}</div>
                          }
                        </div>
                    }
                  </div>
                  : null
              }
              {
                searchType === '期刊' ?
                  <div>
                    {
                      periodicalsLoading ?
                        <div className="loading">
                          <ActivityIndicator text="Loading..."/>
                        </div>
                        :
                        <div>
                          {
                            showNoData ?
                              <div>{this.noData()}</div> : <div>{this.searchPer()}</div>
                          }
                        </div>
                    }
                  </div>
                  : null
              }
              {
                searchType === '作者' ?
                  <div>
                    {
                      authorsLoading ?
                        <div className="loading">
                          <ActivityIndicator text="Loading..."/>
                        </div>
                        :
                        <div>
                          {
                            showNoData ?
                              <div>{this.noData()}</div> : <div>{this.searchAuthors()}</div>
                          }
                        </div>
                    }
                  </div>
                  : null
              }
            </div>
            :
            <div className="key-word">
              <div className="title">搜索指定内容</div>
              <div className="class">
              {
                catalog.map((item, i) => {
                  return(
                  <span key={i} onClick={this.placeholderChange.bind(this, item.name)} className={item.className}>{item.name}</span>
                  )
                })
              }
              </div>
            </div>
        }
      </div>
    )
  }
}

