import SideBar from '../components/side-bar'
import { Outlet } from 'react-router-dom'
export default function Index() {
  return (
    <div className='flex'>
      <SideBar />
      <div className='p-5 flex-1 bg-repeat bg-contain h-screen overflow-auto bg-sky-50'>
        <Outlet />
      </div>
    </div>
  )
}