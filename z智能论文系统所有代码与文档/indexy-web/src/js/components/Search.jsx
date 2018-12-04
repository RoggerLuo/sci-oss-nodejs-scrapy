import React, {Component} from 'react'
import {Input, Form, Button, Select} from 'antd'
import HandleFormType from './HandleFormType'

const FormItem = Form.Item;
const Option = Select.Option;
class Search extends Component {
  render() {
    let fields = this.props.fields
    return (
      <Form layout="inline" className="search-form" onSubmit={this.handleSubmit}>
        <FormItem className="search-items">
          <HandleFormType
            formInstance={this.props.form}
            fields={fields}
            formItemLayout={this.props.formItemLayout}
            formItemType={this.props.formItemType}
          />
        </FormItem>
        <FormItem className="search-btn-box">
          <Button className={this.props.buttonClass} htmlType="submit">{this.props.buttonText}</Button>
        </FormItem>
      </Form>
      )
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.doSearch()
  }
}

const SearchWrapper = Form.create()(Search)
export default SearchWrapper
