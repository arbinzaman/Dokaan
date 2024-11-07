import Header from '../components/shared/landingPage/Header'    
import { Outlet } from 'react-router-dom'
import Footer from '../components/shared/landingPage/Footer'

const Main = () => {
  return (
    <section>
        <Header/>
        <Outlet/>
        <Footer/>
    </section>
  )
}

export default Main