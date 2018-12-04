import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {withRouter} from 'react-router'
import {toJS} from 'mobx'
import {inject} from 'restackx-core'
import {Form, Input, InputNumber, Tree, Col, Row, Icon, TreeSelect, Select, Radio} from 'antd'
import './HandleFormType.css'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const TreeNode = Tree.TreeNode


export default class HandleFormType extends Component {
  render() {
    let fields = this.props.fields
    return (
      <div>
        {fields ? fields.map(this.handleType(this.props.formInstance, this.props.formItemType)) : null}
      </div>
    )
  }
  
  handleType = (form, formItemType) => (field, index) => {
    let {type, value, label, name, rules, disabled, radios, isHidden, ...other} = field
    let {getFieldDecorator} = form
    type = type.toLowerCase()
    let formItemBox = formItemType === 'inline' ? 'formitem-box' : ''
    
    let formItemLayout = this.props.formItemLayout || {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    
    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }
    
    function disabledDate(current) {
      return current && current.valueOf() < Date.now();
    }
    
    function disabledDateTime() {
      return {
        disabledHours: () => range(0, 24).splice(0, 9),
      };
    }
    
    const loop = tree => tree.map((item) => {
      if (item.children.length > 0) {
        return (
          <TreeNode
            title={<span><Icon type={item.status == "1" ? "pause-circle" : "check-circle"}/>{item.name}</span>}
            key={item.id}
            parentIds={item.parentIds ? `${item.parentIds}${item.id}` : null}
            value={item.id}
            type={item.type}
            showIcon>
            {loop(item.children)}
          </TreeNode>
        )
      } else {
        return <TreeNode
          key={item.id}
          parentIds={item.parentIds ? item.parentIds : null}
          title={<span><Icon type={item.status == "1" ? "pause-circle" : "check-circle"}/>{item.name}</span>}
          value={item.id}
          type={item.type}/>;
      }
    });
    switch (type) {
      case 'number':
        return <div key={index}>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan}>
                <FormItem label={label} {...formItemLayout} >
                  {field.preWord ?
                    <span>{field.preWord}</span>
                    :
                    undefined
                  }
                  {getFieldDecorator(name, {
                    initialValue: value || '',
                    rules: rules || null
                  })(
                    <InputNumber
                      min={field.min}
                      max={field.max}
                      disabled={field.readonly}
                      onChange={field.onChange || this.props.onChange}
                      {...other}
                    />
                  )}
                  {field.lastWord ?
                    <span>{field.lastWord}</span>
                    :
                    undefined
                  }
                </FormItem>
              </Col>
          }
        </div>
      case 'input':
        return <div key={index} className={formItemBox}>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan}>
                <FormItem label={label} {...formItemLayout} >
                  {getFieldDecorator(name, {
                    initialValue: value || '',
                    rules: rules
                  })(
                    <Input
                      onChange={field.onChange || this.props.onChange}
                      disabled={disabled}
                      id={name}
                      {...other}
                    />
                  )}
                </FormItem>
              </Col>
          }
        </div>
      case 'select':
        return <div key={index} className={formItemBox}>
          {
            field.isHidden ? undefined
              :
              <Col span={field.colSpan}>
                <FormItem {...formItemLayout} label={label}>
                  {getFieldDecorator(name, {
                    initialValue: value || '',
                    rules: rules || null
                  })(
                    <Select
                      id={field.id}
                      onSelect={field.onSelect || this.props.changeSelect}
                      {...other}>
                      {field.options ?
                        field.options.map((item, index) => (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )) : null
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
          }
        </div>
      case 'datetimepicker':
        return <div>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan} key={index}>
                <FormItem {...formItemLayout} label={label}>
                  {getFieldDecorator(name, {
                    // initialValue: value || '',
                    rules: [{
                      // required: true,
                      message: "不能为空",
                    }]
                  })(
                    <span>
              <DatePicker
                onChange={this.changeTime} showTime format={field.format}
                value={moment(field.value, field.format)}
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}/>
            </span>
                  )
                  }
                </FormItem>
              </Col>
          }
        </div>
      case 'multiselect':
        return <div key={index} className={formItemBox}>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan}>
                <FormItem {...formItemLayout} label={label}>
                  {getFieldDecorator(name, {
                    // initialValue: value || '',
                    rules: [{
                      required: true,
                      message: "不能为空",
                    }]
                  })(<Select
                      id={field.id}
                      mode="multiple"
                      onChange={this.changeMult}
                      {...other}>
                      {field.options ?
                        field.options.map((data, index) => (
                          <Option key={index} value={data.value}>{data.label}</Option>
                        )) : null
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
          }
        </div>
      case 'radiogroup':
        return <div key={index} className={formItemBox}>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan}>
                <FormItem {...formItemLayout} label={label}>
                  {
                    getFieldDecorator(name, {
                      initialValue: field.value,
                      required: true,
                      rules: [{
                        required: true,
                        message: "不能为空",
                      }]
                    })(
                      <RadioGroup name="radiogroup" onChange={field.onChange || this.props.changeRadio}>
                        {
                          radios && radios.map((it, i) => {
                            return <Radio value={it.value} key={i}>{it.label}</Radio>
                          })
                        }
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
          }
        </div>
      case 'tree-select':
        return <div key={index} className={formItemBox}>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan}>
                <FormItem {...formItemLayout} label={label}>
                  {
                    getFieldDecorator(name, {
                      initialValue: field.value,
                      rules: rules || [{
                        required: true,
                        message: "不能为空",
                      }]
                    })(<TreeSelect
                      showSearch={field.showSearch}
                      disabled={disabled}
                      onChange={field.onChange || this.props.changeSelect}
                      onSelect={field.onSelect || this.props.changeSelect}
                      placeholder={field.placeholder}
                      allowClear
                      // value={field.value}
                      treeDefaultExpandAll
                    >
                      {loop(field.options)}
                    </TreeSelect>)
                  }
                
                </FormItem>
              </Col>
          }
        </div>
      case 'text':
        //这里的text是因为审核页面需要显示的只是文字，不需要输入框
        return <div key={index} className={formItemBox}>
          {
            field.isHidden ? undefined :
              <Col span={field.colSpan}>
                <FormItem {...formItemLayout} {...other} label={label}>
                  <span>{field.value}</span>
                </FormItem>
              </Col>
          }
        </div>
    }
  }
}
