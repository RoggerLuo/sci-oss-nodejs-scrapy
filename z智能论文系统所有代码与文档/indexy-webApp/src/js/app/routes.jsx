import React from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom'
import path from './path'
import { getToken } from '../utils/cookies'
import CheckLogin from '../components/CheckLogin'
import Login from '../modules/login/Login'
import Register from '../modules/login/Register'
import HomePage from '../modules/home/Index'
import Interested from '../modules/discovery/Interested'
import Subdivision from '../modules/discovery/Subdivision'
import Details from '../modules/detail/Details'
import ForgetPassword from '../modules/login/ForgetPassword'
import Discovery from '../modules/discovery/Index'
import Message from '../modules/message/Index'
import Work from '../modules/work/Work'
import My from '../modules/my/Index'
import PeriodicalDetail from '../modules/detail/Periodical'
import AddCustom from '../modules/discovery/add/Custom'
import AddPeriodical from '../modules/discovery/add/Periodicals'
import Author from '../modules/discovery/add/Author'
import AuthorDetail from '../modules/detail/Author'
import Search from '../modules/search/Search'
import Result from '../modules/detail/Result'
import Classification from '../modules/classification/Classification'
import ClassificationManagement from '../modules/classification/ClassificationManagement'
import AddClassification from '../modules/classification/Add'
import Read from '../modules/detail/Read'

let token = getToken()
export default (
  <Route path="/" >
      <Switch>
        <Route path={path.login.url} component={Login} />
        <Route path={path.register.url} component={Register}/>
        <Route path={path.forgetPassword.url} component={ForgetPassword} />
        <CheckLogin>
          <Route exact path="/index.html" component={HomePage} />
          <Route exact path={path.home.url} component={HomePage} />
          <Route exact path={path.interested.index.url} component={Interested} />
          <Route exact path={`${path.interested.subdivision.url}/:id`} component={Subdivision} />
          <Route exact path={path.discovery.index.url} component={Discovery} />
          <Route exact path={`${path.details.url}/:id`} component={Details} />
          <Route exact path={path.message.url} component={Message} />
          <Route exact path={path.work.url} component={Work} />
          <Route exact path={path.my.index.url} component={My} />
          <Route exact path={`${path.periodicalDetail.url}/:id`} component={PeriodicalDetail} />
          <Route exact path={path.discovery.addCustom.url} component={AddCustom} />
          <Route exact path={path.discovery.addPeriodical.url} component={AddPeriodical} />
          <Route exact path={path.discovery.addAuthor.url} component={Author} />
          <Route exact path={`${path.authorDetail.url}/:id`} component={AuthorDetail} />
          <Route exact path={`${path.editCustom.url}/:id`} component={AddCustom} />
          <Route exact path={path.search.url} component={Search} />
          <Route exact path={`${path.result.url}/:id`} component={Result} />
          <Route exact path={`${path.classification.url}/:id`} component={Classification} />
          <Route exact path={path.ClassificationManagement.url} component={ClassificationManagement} />
          <Route exact path={path.ClassificationManagement.add.url} component={AddClassification} />
          <Route exact path={`${path.ClassificationManagement.add.url}/:id`} component={AddClassification} />
          <Route exact path={`${path.read.url}/:id`} component={Read} />
        </CheckLogin>
      </Switch>
  </Route>
);
