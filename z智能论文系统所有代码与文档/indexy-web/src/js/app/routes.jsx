import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
// import CheckLogin from '../components/CheckLogin'
import NoMatch from '../frame/NoMatch'
import { getToken } from '../utils/cookies'
import App from '../frame/App'
import Tasks from '../modules/tasks/Tasks'
import TaskResult from '../modules/tasks/TaskResult'
import KnowledgeGraph from '../modules/knowledgeGraph/KnowledgeGraph'
import ThesisManagement from '../modules/thesisManagement/ThesisManagement'
import UsersManagement from '../modules/usersManagement/UsersManagement'
import AuthorsManagement from '../modules/authorsManagement/AuthorsManagement'
import FieldsManagement from  '../modules/fieldsManagement/FieldsManagement'
import path from '../frame/path'

export default (
  <Route path="/">
    <App>
      <Switch>
        <Route exact path="/" component={Tasks} />
        <Route exact path="/index" component={Tasks}/>
        <Route exact path="/index.html" component={Tasks}/>
        <Route exact path={path.tasks.index.url} component={Tasks}/>
        <Route exact path={path.taskResult.index.url} component={TaskResult}/>
        <Route exact path={path.knowledgeGraph.index.url} component={KnowledgeGraph}/>
        <Route exact path={path.thesisManagement.index.url} component={ThesisManagement}/>
        <Route exact path={path.usersManagement.index.url} component={UsersManagement}/>
        <Route exact path={path.authorsManagement.index.url} component={AuthorsManagement}/>
        <Route exact path={path.fieldsManagement.index.url} component={FieldsManagement}/>
        <Route path="*" component={NoMatch}/>
      </Switch>
    </App>
  </Route>
)
