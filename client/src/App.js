import React from 'react'
import HomeScreen from './components/homescreen/HomeScreen'
import WelcomeScreen from './components/welcomescreen/WelcomeScreen'
import UpdateScreen from './components/updatescreen/UpdateScreen'
import RegionViewer from './components/regionviewer/RegionViewer'
import RegionSpreadSheet from './components/regionspreedsheet/RegionSpreadSheet'
import { useQuery } from '@apollo/client'
import * as queries from './cache/queries'
import { jsTPS } from './utils/jsTPS'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

const App = () => {
  let user = null
  let transactionStack = new jsTPS()
  let refreshTps = false
  const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER)

  if (error) {
    console.log(error)
  }
  if (loading) {
    console.log(loading)
  }
  if (data) {
    let { getCurrentUser } = data
    if (getCurrentUser !== null) {
      user = getCurrentUser
    }
  }
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from='/' to={{ pathname: '/welcome' }} />
        {user && <Redirect exact from='/welcome' to={{ pathname: '/home' }} />}
        <Route
          path='/welcome'
          name='welcome'
          render={() => (
            <WelcomeScreen
              tps={transactionStack}
              fetchUser={refetch}
              user={user}
              refreshTps={refreshTps}
            />
          )}
        />

        <Route
          exact
          path='/update'
          render={({ match }) => (
            <UpdateScreen fetchUser={refetch} user={user} match={match} />
          )}
        />
        {!user && <Redirect exact from='/home' to={{ pathname: '/welcome' }} />}
        <Route
          path='/home'
          name='home'
          render={() => (
            <HomeScreen
              tps={transactionStack}
              fetchUser={refetch}
              user={user}
              refreshTps={refreshTps}
            />
          )}
        />
        <Route
          path='/region/:id'
          name='region'
          render={({ match, location }) => (
            <RegionSpreadSheet
              fetchUser={refetch}
              user={user}
              match={match}
              location={location}
            />
          )}
        ></Route>
        <Route
          name='/regionviewer/:id'
          path='/regionviewer'
          render={({ match, location }) => (
            <RegionViewer
              fetchUser={refetch}
              user={user}
              match={match}
              location={location}
            />
          )}
        ></Route>
      </Switch>
    </BrowserRouter>
  )
}
export default App
