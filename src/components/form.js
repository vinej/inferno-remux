import React from 'react';
import { observer } from "mobx-react";
import { dispatch } from '../resolvers/dispatcher'
import { todoAdd, todoDelete, todoSetDesc } from '../actions/todo_actions'
import Button from '../ui/Button' 
import Checkbox from '../ui/Checkbox' 
import CheckboxGroup from '../ui/CheckboxGroup' 
import Filter from '../ui/Filter' 

export default class Form extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const store = this.props.store
    return ( 
      <div>
        <Button status="primary">Primary Button</Button>
        <Button>Button</Button>
        <div/>
        <Checkbox>checked box test</Checkbox>

        <CheckboxGroup value="shenzhen,chongqing" data={[
          { "id": "nanjing", "text": "nanjing" },
          { "id": "beijing", "text": "beijing" },
          { "id": "guangzhou", "text": "guangzhou" },
          { "id": "shenzhen", "text": "shenzhen" },
          { "id": "chengdu", "text": "chengdu" },
          { "id": "chongqing", "text": "chongqing" },
          { "id": "shanghai", "text": "shanghai" }
          ]} >
            <Checkbox position={3} checkValue="aa">aaaaaa</Checkbox>
        </CheckboxGroup>

        <Filter local={true}
          onFilter={fs => this.setState({ filterText: JSON.stringify(fs) })}
            options={[{
              label: '姓名',
              name: 'name',
              ops: ['like', '=', 'startWidth']
            }, {
              label: '年龄',
              name: 'age',
              ops: ['>=', '<'],
              type: 'number'
            }, {
              label: '生日',
              name: 'birthday',
              ops: ['>=', '<'],
              type: 'datetime'
            }, {
              label: '地区',
              name: 'office',
              ops: ['='],
              type: 'select',
              props: { data: ['Tokyo', 'Singapore', 'New York', 'London', 'San Francisco'] }
            }, {
              label: '国籍',
              name: 'country',
              ops: ['='],
              type: 'select',
              props: { fetch: {url: 'json/countries.json', cache:3600}, optionTpl: '{country}', valueTpl: '{en}' }
            }]} />
        <div>{this.state.filterText}</div>
      </div>          
      )
    }
}
